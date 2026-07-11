"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Droplets,
  Flame,
  ShieldAlert,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

import { moveCareStep } from "@/lib/quartz-care";
import { translations, type Lang } from "@/lib/translations";

const scenarioIcons: readonly LucideIcon[] = [Droplets, Sparkles, Flame, ShieldAlert];
const scenarioStates = ["daily", "stain", "heat", "avoid"] as const;

export function QuartzCare({ lang }: { lang: Lang }) {
  const copy = translations[lang].care;
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const activeScenario = copy.scenarios[activeIndex];
  const activeState = scenarioStates[activeIndex];
  const ActiveIcon = scenarioIcons[activeIndex] ?? Droplets;

  function handleScenarioKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = moveCareStep(activeIndex, direction, copy.scenarios.length);
    setActiveIndex(nextIndex);
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="quartz-care" aria-labelledby="quartz-care-title">
      <div className="section-shell">
        <motion.header
          className="quartz-care-header"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
        >
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="quartz-care-title" className="display-title quartz-care-title">
            {copy.title}
          </h2>
          <p className="quartz-care-lead">{copy.lead}</p>
        </motion.header>

        <div className="quartz-care-layout">
          <motion.div
            className="quartz-care-stage"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reducedMotion ? 0 : 0.36 }}
            aria-hidden="true"
          >
            <div className="quartz-care-stage-meta">
              <span>KVARC-S / CARE</span>
              <span>0{activeIndex + 1}</span>
            </div>
            <div className="quartz-care-slab">
              <div className="quartz-care-mineral-lines" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeState}
                  className={`quartz-care-visual quartz-care-visual--${activeState}`}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, x: -14 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03, x: 14 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                >
                  <span className="quartz-care-visual-icon">
                    <ActiveIcon size={34} strokeWidth={1.4} />
                  </span>
                  <span className="quartz-care-visual-orbit" />
                  <span className="quartz-care-visual-mark quartz-care-visual-mark--one" />
                  <span className="quartz-care-visual-mark quartz-care-visual-mark--two" />
                  <span className="quartz-care-visual-mark quartz-care-visual-mark--three" />
                </motion.div>
              </AnimatePresence>
              <div className="quartz-care-slab-caption">
                <span>{activeScenario.label}</span>
                <span>QUARTZ SURFACE</span>
              </div>
            </div>
          </motion.div>

          <div className="quartz-care-content">
            <div className="quartz-care-controls" aria-label={copy.controlsLabel}>
              {copy.scenarios.map((scenario, index) => {
                const Icon = scenarioIcons[index] ?? Droplets;
                const active = index === activeIndex;

                return (
                  <button
                    key={scenario.label}
                    ref={(node) => {
                      buttonRefs.current[index] = node;
                    }}
                    type="button"
                    className="quartz-care-control focus-ring"
                    aria-pressed={active}
                    aria-controls="quartz-care-active-scenario"
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={handleScenarioKeyDown}
                  >
                    <span className="quartz-care-control-number">0{index + 1}</span>
                    <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                    <span>{scenario.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              id="quartz-care-active-scenario"
              className="quartz-care-scenario"
              aria-live="polite"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${lang}-${activeIndex}`}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.26 }}
                >
                  <p className="quartz-care-scenario-index">0{activeIndex + 1} / 04</p>
                  <h3>{activeScenario.title}</h3>
                  <p className="quartz-care-scenario-body">{activeScenario.body}</p>
                  <p className="quartz-care-scenario-action">{activeScenario.action}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="quartz-care-notes">
              <p>
                <Check size={18} aria-hidden="true" />
                <span>{copy.noSeal}</span>
              </p>
              <p>
                <Sparkles size={18} aria-hidden="true" />
                <span>{copy.finishNote}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
