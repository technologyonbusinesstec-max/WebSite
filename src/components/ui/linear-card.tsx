import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { motion, type Transition, type Variant } from "motion/react";
import { XIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import "../../styles/linear-card.css";

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C0 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function isLiveUrl(url?: string) {
  return Boolean(url && url !== "#");
}

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!isLiveUrl(href)) {
    return (
      <span className="lc-social lc-social--disabled" aria-disabled="true" title={label}>
        {children}
        <span>{label}</span>
      </span>
    );
  }

  return (
    <a className="lc-social" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {children}
      <span>{label}</span>
    </a>
  );
}

interface DialogContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

const DIMMER_ID = "lc-dimmer";

function ensureDimmer() {
  let el = document.getElementById(DIMMER_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = DIMMER_ID;
    el.className = "lc-dimmer";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  return el;
}

function showDim() {
  ensureDimmer().classList.add("is-on");
}

function hideDim() {
  document.getElementById(DIMMER_ID)?.classList.remove("is-on");
}

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpenState] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);

  const setIsOpen = useCallback((value: React.SetStateAction<boolean>) => {
    const prev = isOpenRef.current;
    const next = typeof value === "function" ? value(prev) : value;
    isOpenRef.current = next;
    if (next) showDim();
    else hideDim();
    flushSync(() => setOpenState(next));
  }, []);

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, setIsOpen, uniqueId]
  );

  useEffect(() => {
    return () => {
      if (isOpenRef.current) hideDim();
    };
  }, []);

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

function Dialog({ children }: { children: React.ReactNode; transition?: Transition }) {
  return <DialogProvider>{children}</DialogProvider>;
}

function DialogTrigger({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useDialog();
  const handleClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    },
    [isOpen, setIsOpen]
  );

  return (
    <div
      ref={triggerRef}
      className={cn("lc-card", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`dialog-content-${uniqueId}`}
    >
      {children}
    </div>
  );
}

function DialogContent({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const focusable = containerRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      focusable?.focus();
    } else {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      className={cn("lc-dialog", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dialog-title-${uniqueId}`}
      aria-describedby={`dialog-description-${uniqueId}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function DialogContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen, setIsOpen } = useDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={cn("lc-overlay", className)}>
      <div className="lc-backdrop" onClick={() => setIsOpen(false)} />
      <div className="lc-dialog-slot">{children}</div>
    </div>,
    document.body
  );
}

function DialogTitle({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { uniqueId } = useDialog();
  return (
    <div className={className} style={style} id={`dialog-title-${uniqueId}`}>
      {children}
    </div>
  );
}

function DialogSubtitle({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { uniqueId } = useDialog();
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

function DialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: {
  children: React.ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: { initial: Variant; animate: Variant; exit: Variant };
}) {
  const { uniqueId } = useDialog();
  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={disableLayoutAnimation ? undefined : `dialog-description-content-${uniqueId}`}
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

function DialogImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return <img src={src} alt={alt} className={cn(className)} style={style} />;
}

function DialogClose({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { setIsOpen, uniqueId } = useDialog();
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <motion.button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn("lc-close", className)}
    >
      {children || <XIcon size={22} />}
    </motion.button>
  );
}

export type LinearCardItem = {
  id: number;
  url: { src: string };
  title: string;
  description: string;
  subtitle?: string;
  linkedin?: string;
  instagram?: string;
  linkedinLabel?: string;
  instagramLabel?: string;
  talks?: { title: string; when: string }[];
  talksLabel?: string;
  talksLinkLabel?: string;
};

const Component = forwardRef<HTMLDivElement, { items: LinearCardItem[] }>(({ items }, ref) => {
  return (
    <div ref={ref} className="lc-grid">
      {items.map((item) => (
        <Dialog key={item.id}>
          <DialogTrigger>
            <DialogImage src={item.url.src} alt={item.title} className="lc-card-img" />
            <div className="lc-card-copy">
              <DialogTitle className="lc-card-title">{item.title}</DialogTitle>
              {item.subtitle ? (
                <DialogSubtitle className="lc-card-role">{item.subtitle}</DialogSubtitle>
              ) : null}
              {item.talks?.length ? (
                <p className="lc-card-talk">{item.talks[0].title}</p>
              ) : null}
            </div>
          </DialogTrigger>
          <DialogContainer>
            <DialogContent style={{ borderRadius: 16 }}>
              <div className="lc-dialog-body">
                <div className="lc-profile">
                  <DialogImage src={item.url.src} alt={item.title} className="lc-dialog-img" />
                  <div className="lc-profile-copy">
                    <DialogTitle className="lc-dialog-title">{item.title}</DialogTitle>
                    {item.subtitle ? (
                      <DialogSubtitle className="lc-dialog-role">{item.subtitle}</DialogSubtitle>
                    ) : null}
                    <DialogDescription
                      disableLayoutAnimation
                      variants={{
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: 8 },
                      }}
                    >
                      <p className="lc-dialog-desc">{item.description}</p>
                      {item.talks?.length ? (
                        <div className="lc-talks">
                          <span className="lc-talks-label">{item.talksLabel || "En el programa"}</span>
                          <ul>
                            {item.talks.map((talk) => (
                              <li key={talk.title + talk.when}>
                                <strong>{talk.title}</strong>
                                <span>{talk.when}</span>
                              </li>
                            ))}
                          </ul>
                          <a className="lc-talks-link" href="/programa">
                            {item.talksLinkLabel || "Ver en el programa"} →
                          </a>
                        </div>
                      ) : null}
                    </DialogDescription>
                  </div>
                </div>
                <div className="lc-socials">
                  <SocialLink href={item.linkedin} label={item.linkedinLabel || "LinkedIn"}>
                    <LinkedinIcon size={16} />
                  </SocialLink>
                  <SocialLink href={item.instagram} label={item.instagramLabel || "Instagram"}>
                    <InstagramIcon size={16} />
                  </SocialLink>
                </div>
              </div>
              <DialogClose />
            </DialogContent>
          </DialogContainer>
        </Dialog>
      ))}
    </div>
  );
});

Component.displayName = "Component";

export type SpeakerCardItem = {
  id: number;
  foto: string;
  nameKey: string;
  roleKey: string;
  bioKey: string;
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
  instagram?: string;
  talks?: { titleKey: string; title: string; dayKey: string; day: string; time: string }[];
};

function useTobLang() {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    const saved = (localStorage.getItem("tob_lang") || "es").toLowerCase();
    setLang(saved);
    const onChange = (event: Event) => {
      const next = (event as CustomEvent).detail?.lang;
      if (typeof next === "string") setLang(next.toLowerCase());
    };
    window.addEventListener("languageChanged", onChange);
    return () => window.removeEventListener("languageChanged", onChange);
  }, []);

  const t = (key: string, fallback: string) => {
    if (typeof window === "undefined") return fallback;
    const dict = (window as unknown as { translations?: Record<string, Record<string, string>> }).translations?.[lang];
    return dict?.[key] ?? fallback;
  };

  return { lang, t };
}

export function SpeakerLinearCards({ items }: { items: SpeakerCardItem[] }) {
  useEffect(() => {
    ensureDimmer();
    return () => hideDim();
  }, []);

  const { t } = useTobLang();
  const mapped: LinearCardItem[] = items.map((item) => ({
    id: item.id,
    url: { src: item.foto },
    title: t(item.nameKey, item.name),
    subtitle: t(item.roleKey, item.role),
    description: t(item.bioKey, item.bio),
    linkedin: item.linkedin || undefined,
    instagram: item.instagram || undefined,
    linkedinLabel: t("spk_linkedin", "LinkedIn"),
    instagramLabel: t("spk_instagram", "Instagram"),
    talks: item.talks?.map((talk) => ({
      title: t(talk.titleKey, talk.title),
      when: `${t(talk.dayKey, talk.day)} · ${talk.time}`,
    })),
    talksLabel: t("spk_talk_label", "En el programa"),
    talksLinkLabel: t("spk_talk_link", "Ver en el programa"),
  }));

  return <Component items={mapped} />;
}

export default Component;
