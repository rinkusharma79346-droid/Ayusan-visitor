"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePublicConfig } from "@/lib/public-config";
import { useReserve } from "./ReserveContext";
import type { VisitSlot } from "@/lib/ayusan-supabase";

function indiaToday() {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });
  const parts = fmt.formatToParts(new Date());
  const get = (type: string) => parts.find(p=>p.type===type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const schema = z.object({
  name: z.string().trim().max(80, "Name is too long."),
  phone: z.string().trim().refine(v => !v || /^\+?[0-9\s()-]{7,24}$/.test(v), "Please enter a valid phone number, or leave it blank."),
  dateOfBirth: z.string().refine(v=>!v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && v <= indiaToday()), "Enter a valid past date of birth."),
  slotId: z.string().uuid("Choose an available session."),
  extras: z.string().trim().max(500, "Extra requests cannot exceed 500 characters."),
  whatsappOptIn: z.boolean(),
  callOptIn: z.boolean(),
});
type FormData = z.infer<typeof schema>;

type TurnstileApi = {
  render: (container: HTMLElement, config: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

function TurnstileVerification({
  onToken,
  resetSignal,
}: {
  onToken: (token: string) => void;
  resetSignal: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const siteKey = usePublicConfig().turnstileSiteKey;
  const [widgetError, setWidgetError] = useState<string>("");
  useEffect(()=>{
    if (!siteKey) return;
    let alive = true;
    const render = () => {
      if(!alive || !window.turnstile || !containerRef.current || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey, action: "register", theme: "light", size: "flexible",
        callback: (token: unknown)=>{
          setWidgetError("");
          onToken(String(token || ""));
        },
        "expired-callback": ()=>onToken(""),
        "error-callback": (code?: unknown)=>{
          onToken("");
          const errCode = String(code || "");
          const host = typeof window !== "undefined" ? window.location.hostname : "";
          if (errCode.startsWith("110200")) {
            setWidgetError(`Turnstile domain not authorized (${errCode}). In Cloudflare Turnstile Hostname Management, add bare hostname: ${host} (without https://).`);
          } else if (errCode) {
            setWidgetError(`Security verification could not load (code ${errCode}).`);
          }
          return true;
        },
      });
    };
    const scriptId = "ayusan-turnstile-loader";
    const found = document.getElementById(scriptId) as HTMLScriptElement | null;
    if(found){found.addEventListener("load",render);render();}
    else {const script=document.createElement("script");script.id=scriptId;script.async=true;script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.addEventListener("load",render);document.head.appendChild(script);}
    return ()=>{alive=false;if(widgetRef.current && window.turnstile){window.turnstile.remove(widgetRef.current);widgetRef.current=null;}};
  },[siteKey,onToken]);
  useEffect(() => {
    if (resetSignal > 0 && widgetRef.current && window.turnstile) {
      onToken("");
      window.turnstile.reset(widgetRef.current);
    }
  }, [resetSignal, onToken]);
  if(!siteKey) return <div className="form-alert" role="alert">The library is finishing its secure registration setup. Please contact the desk in the meantime.</div>;
  return (
    <div>
      <div ref={containerRef} aria-label="Security verification" style={{minHeight:68,marginTop:12,marginBottom:12}}/>
      {widgetError ? <div className="form-alert" role="alert">{widgetError}</div> : null}
    </div>
  );
}

function formatSlot(slot: VisitSlot) {
  const date = new Date(slot.visit_date + "T12:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  return `${date} - ${slot.label} (${slot.start_time.slice(0,5)}-${slot.end_time.slice(0,5)})`;
}

/** Connects the existing Ayusan public design to live Supabase time slots and submissions. */
export function ReserveModal() {
  const { isOpen, closeReserve } = useReserve();
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [successData, setSuccessData] = useState<FormData | null>(null);
  const [slotType, setSlotType] = useState<string>("");
  const [slots, setSlots] = useState<VisitSlot[]>([]);
  const [slotsLoading,setSlotsLoading]=useState(false);
  const [slotsError,setSlotsError]=useState("");
  const [sessionStatus,setSessionStatus]=useState<Record<string,string>>({});
  const [refreshKey,setRefreshKey]=useState(0);
  const [captchaToken,setCaptchaToken]=useState("");
  const [captchaResetKey,setCaptchaResetKey]=useState(0);
  const submissionId=useRef("");
  const panelRef=useRef<HTMLElement>(null);
  const titleRef=useRef<HTMLHeadingElement>(null);
  const lastFocus=useRef<HTMLElement|null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState:{ errors, isSubmitted }} = useForm<FormData>({
    resolver:zodResolver(schema),
    defaultValues:{name:"",phone:"",dateOfBirth:"",slotId:"",extras:"",whatsappOptIn:false,callOptIn:false},
  });
  const phoneValue=watch("phone");
  const selectedSlotId=watch("slotId");
  const typeSlots=slots.filter(s=>s.label===slotType);
  const selectedSlot=slots.find(s=>s.id===selectedSlotId);
  useEffect(()=>{const current=slots.find(s=>s.id===selectedSlotId&&s.label===slotType&&s.available_seats>0);if(!current){const next=slots.find(s=>s.label===slotType&&s.available_seats>0)?.id||"";if(next!==selectedSlotId)setValue("slotId",next,{shouldValidate:isSubmitted});}},[slots,slotType,selectedSlotId,setValue,isSubmitted]);
  const chooseType=(value: string)=>{setSlotType(value);setValue("slotId",slots.find(s=>s.label===value&&s.available_seats>0)?.id||"",{shouldValidate:isSubmitted});};
  useEffect(()=>{if(!phoneValue?.trim()){setValue("whatsappOptIn",false);setValue("callOptIn",false);}},[phoneValue,setValue]);

  useEffect(()=>{
    if(!isOpen) return;
    let active=true;
    setSlotsError("");setSlotsLoading(true);
    fetch("/api/slots",{cache:"no-store"}).then(async r=>{
      const body=await r.json().catch(()=>({})) as {error?: string;slots?: VisitSlot[];session_status?: Record<string,string>;reference_code?: string};
      if(!r.ok)throw new Error(body.error || "Cannot retrieve available sessions.");
      return body;
    }).then(body=>{if(active){setSlots(Array.isArray(body.slots)?body.slots:[]);setSessionStatus(body.session_status||{});}})
      .catch(e=>{if(active)setSlotsError(e instanceof Error?e.message:"Cannot retrieve available sessions.");})
      .finally(()=>{if(active)setSlotsLoading(false);});
    return ()=>{active=false;};
  },[isOpen,refreshKey]);

  useEffect(()=>{if(!isOpen)return;const refresh=()=>setRefreshKey(k=>k+1);const timer=setInterval(refresh,60000);window.addEventListener("focus",refresh);return()=>{clearInterval(timer);window.removeEventListener("focus",refresh);};},[isOpen]);

  useEffect(()=>{
    if(!isOpen)return;
    document.body.style.overflow="hidden";
    lastFocus.current=document.activeElement as HTMLElement|null;
    const timer=setTimeout(()=>panelRef.current?.querySelector<HTMLInputElement>("#fullName")?.focus(),130);
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){closeReserve();return;}
      if(e.key!=="Tab")return;
      const panel=panelRef.current;if(!panel)return;
      const els=Array.from(panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(e=>e.offsetParent!==null);
      if(!els.length)return;
      const first=els[0],last=els[els.length-1];const active=document.activeElement;
      if(!panel.contains(active)){e.preventDefault();first.focus();}
      else if(e.shiftKey&&active===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&active===last){e.preventDefault();first.focus();}
    };
    window.addEventListener("keydown",onKey);
    return ()=>{document.body.style.overflow="";window.removeEventListener("keydown",onKey);clearTimeout(timer);lastFocus.current?.focus?.();};
  },[isOpen,closeReserve]);

  useEffect(()=>{if(status==="success")titleRef.current?.focus();},[status]);
  const onSubmit=async(data:FormData)=>{
    if(!selectedSlot || selectedSlot.available_seats<1){setServerError("Please choose a time slot with available seats.");setStatus("error");return;}
    if(!captchaToken){setServerError("Please complete the security verification before submitting.");setStatus("error");return;}
    if(!submissionId.current)submissionId.current=crypto.randomUUID();
    setStatus("loading");setServerError("");
    try{
      const res=await fetch("/api/register",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:data.name,phone:data.phone,date_of_birth:data.dateOfBirth,
          slot_id:data.slotId,extras:data.extras,whatsapp_opt_in:Boolean(data.phone.trim()&&data.whatsappOptIn),call_opt_in:Boolean(data.phone.trim()&&data.callOptIn),
          captcha_token:captchaToken,"cf-turnstile-response":captchaToken,client_submission_id:submissionId.current,
        }),
      });
      const body=await res.json().catch(()=>({})) as {error?: string;reference_code?: string};
      if(!res.ok || !body.reference_code)throw new Error(body.error || "The request could not be submitted.");
      setReference(body.reference_code);setSuccessData(data);setStatus("success");
    }catch(e){setStatus("error");setServerError(e instanceof Error?e.message:"Please try again.");setCaptchaToken("");setCaptchaResetKey(k=>k+1);}
  };

  const resetAll=()=>{reset();setSlotType("");setStatus("idle");setReference("");setSuccessData(null);setServerError("");setCaptchaToken("");setCaptchaResetKey(k=>k+1);submissionId.current="";};
  const handleClose=()=>{closeReserve();if(status==="success")resetAll();};
  const chosenSlot=slots.find(s=>s.id===successData?.slotId);
  const hasErrors=isSubmitted&&Object.keys(errors).length>0;
  const captchaCallback=useCallback((token:string)=>setCaptchaToken(token),[]);

  return <AnimatePresence>{isOpen&&<motion.div className="dialog-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.2}} onClick={e=>{if(e.target===e.currentTarget)handleClose();}}>
    <motion.section ref={panelRef} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" tabIndex={-1} id="dialog" initial={reduced?false:{y:26,opacity:0}} animate={{y:0,opacity:1}} exit={reduced?{opacity:0}:{y:18,opacity:0}} transition={{duration:.28,ease:[.22,1,.36,1]}}>
      <aside className="dialog-side">
        <span className="modal-brand">A Y U S A N &nbsp;/&nbsp; L I B R A R Y</span>
        <span className="modal-tag">T H E &nbsp;R E A D I N G &nbsp;R O O M</span>
        <h2>Make room<br/>for focus.</h2>
        <p>Give your attention somewhere good to go. Request a visit and we will confirm your place.</p>
        <div className="step-list"><div className="step"><em>01</em><span>Share your plans</span></div><div className="step"><em>02</em><span>We check availability</span></div><div className="step"><em>03</em><span>Receive confirmation</span></div></div>
      </aside>
      <div className="dialog-main">
        <button type="button" className="close-dialog" aria-label="Close reservation form" onClick={handleClose}>&times;</button>
        {status==="success"&&successData?<div className="confirmation">
          <span className="modal-eyebrow">02 / 02 &nbsp; REQUEST SUMMARY</span>
          <div className="success-symbol" aria-hidden="true">&#10003;</div>
          <h3 id="dialogTitle" tabIndex={-1} ref={titleRef}>Your request is with us.</h3>
          <p className="modal-description">Your registration request was saved and is awaiting the library owner&apos;s review. This does not confirm a seat yet.</p>
          <div className="status">STATUS / PENDING APPROVAL</div>
          <div className="receipt">
            <div className="receipt-row"><span>Name</span><strong>{successData.name||"Guest visitor"}</strong></div>
            <div className="receipt-row"><span>Preferred session</span><strong>{chosenSlot?formatSlot(chosenSlot):"Selected session"}</strong></div>
            <div className="receipt-row"><span>Reference</span><strong>{reference}</strong></div>
            <div className="receipt-row"><span>Approval call</span><strong>{successData.phone&&successData.callOptIn?"Requested":"Not selected"}</strong></div>
            <div className="receipt-row"><span>WhatsApp update</span><strong>{successData.phone&&successData.whatsappOptIn?"Requested":"Not selected"}</strong></div>
          </div>
          <p className="demo-notice">Save your reference. If you opted in to an approval call, the library will attempt to call after approval. Calls depend on the number being reachable. If you selected WhatsApp updates, the owner can send your confirmation personally after approval.</p>
          <div className="dialog-actions"><button type="button" className="btn" onClick={resetAll}>Make another request &rarr;</button><button type="button" className="btn secondary" onClick={handleClose}>Return to library</button></div>
        </div>:<div>
          <span className="modal-eyebrow">01 / 02 &nbsp; YOUR REQUEST</span>
          <h3 id="dialogTitle">Reserve a reading seat.</h3>
          <p className="modal-description">Choose a reading shift. We’ll select its next available date for your request.</p>
          {hasErrors?<div className="form-alert" role="alert">Please review the highlighted fields below.</div>:null}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="field-heading">YOUR DETAILS (OPTIONAL)</div>
            <div className="form-row">
              <div className="field"><label htmlFor="fullName">Full name <span className="optional">(optional)</span></label><input id="fullName" autoComplete="name" placeholder="Your full name" aria-invalid={!!errors.name} {...register("name")}/><span className="field-error" role="alert">{errors.name?.message??""}</span></div>
              <div className="field"><label htmlFor="phone">Mobile number <span className="optional">(optional)</span></label><input type="tel" id="phone" autoComplete="tel" placeholder="10-digit mobile number" aria-invalid={!!errors.phone} {...register("phone")}/><span className="field-error" role="alert">{errors.phone?.message??""}</span></div>
            </div>
            <div className="form-row"><div className="field"><label htmlFor="dob">Date of birth <span className="optional">(optional)</span></label><input id="dob" type="date" max={indiaToday()} aria-invalid={!!errors.dateOfBirth} {...register("dateOfBirth")}/><span className="field-error" role="alert">{errors.dateOfBirth?.message??""}</span></div></div>
            <div className="field-heading">PLAN YOUR VISIT</div><button type="button" className="text-button" onClick={()=>setRefreshKey(k=>k+1)} disabled={slotsLoading}>{slotsLoading?"Refreshing availability...":"Refresh availability"}</button>
            <div className="field"><label htmlFor="timeSlotType">Time slot *</label>
              <select id="timeSlotType" value={slotType} onChange={e=>chooseType(e.target.value as typeof slotType)} disabled={slotsLoading} aria-invalid={!!errors.slotId}>
                <option value="">{slotsLoading?"Loading availability...":"Choose your time slot"}</option>
                {Array.from(new Set(slots.map(s=>s.label))).map(label=><option key={label} value={label}>{label}</option>)}
              </select>
              <span className="field-error" role="alert">{errors.slotId?.message??""}</span>
              {slotsError&&<span className="field-error" role="alert">{slotsError}</span>}
            </div>
            {slotType&&<div className="field">
              <input type="hidden" {...register("slotId")}/>
              <div className="night-note" role="status"><strong>Available seats: </strong>{selectedSlot?`${selectedSlot.available_seats} of ${selectedSlot.capacity}`:slotsError?"Unable to load availability":typeSlots.length?"This slot is full":sessionStatus[slotType]==="ended"?"Published sessions have ended. No future date is available.":sessionStatus[slotType]==="closed"?"Registration is closed for this time slot.":"No future sessions are available for this shift. Refresh availability or choose another shift."}{selectedSlot&&<><br/>Next available: {formatSlot(selectedSlot)}</>}<br/>Seat capacity and final seat assignment are managed by the owner.</div>
            </div>}
            <div className="field"><label htmlFor="notes">Anything else? <span className="optional">(optional)</span></label><textarea id="notes" placeholder="Extra requirements, seating preferences, or questions" aria-invalid={!!errors.extras} {...register("extras")}/><span className="field-error" role="alert">{errors.extras?.message??""}</span></div>
            {Boolean(phoneValue?.trim())&&<label className="checkbox-line" htmlFor="whatsappOptIn"><input type="checkbox" id="whatsappOptIn" {...register("whatsappOptIn")}/><span>I agree to receive registration status updates from Ayusan Library via WhatsApp.</span></label>}
            <label className="checkbox-line" htmlFor="callOptIn"><input type="checkbox" id="callOptIn" disabled={!phoneValue?.trim()} {...register("callOptIn")}/><span>I agree to receive an automated approval call from Ayusan Library at my provided number.</span></label>
            <p className="night-note">Your details are used only to process this request. Name, phone and date of birth are optional; Automated calls require a valid Indian mobile number and your consent. If you selected WhatsApp updates, the owner can send your confirmation personally after approval.</p>
            <TurnstileVerification onToken={captchaCallback} resetSignal={captchaResetKey}/>
            {status==="error"&&serverError&&<div className="form-alert" role="alert">{serverError}</div>}
            <div className="dialog-actions"><button type="submit" className="btn" disabled={status==="loading"||slotsLoading||Boolean(slotsError)||!selectedSlot||selectedSlot.available_seats===0||!captchaToken}>{status==="loading"?"Sending request...":"Submit registration request"} <span className="arrow">&rarr;</span></button><span className="supporting">Request only. No payment is collected. Availability is confirmed separately.</span></div>
          </form>
        </div>}
      </div>
    </motion.section>
  </motion.div>}</AnimatePresence>;
}
