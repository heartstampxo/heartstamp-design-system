import React from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import {
  AnatomySlider,
  MascotGrid,
  ANATOMY,
  POSING_STAMPY,
  SOCIAL_POSES,
  EXPRESSIONS,
} from "../components/ui/hs-mascot";

export function PageMascot() {
  const assetTotal = POSING_STAMPY.length + SOCIAL_POSES.length + EXPRESSIONS.length;

  return (
    <DocPage
      title="Mascot"
      subtitle={`Stampy — the HeartStamp mascot · ${assetTotal} downloadable assets`}
    >
      <DocSection
        title="Anatomy & Reference"
        desc="Construction sheets showing Stampy's body parts, proportions, and full-turn reference."
      >
        <AnatomySlider slides={ANATOMY} />
      </DocSection>

      <DocSection
        title="Posing Stampy"
        desc="Full-body character poses for use in marketing and product surfaces."
      >
        <MascotGrid assets={POSING_STAMPY} />
      </DocSection>

      <DocSection
        title="Social Ready Poses"
        desc="Polished full-body poses optimised for social media and campaign use."
      >
        <MascotGrid assets={SOCIAL_POSES} />
      </DocSection>

      <DocSection
        title="Expressions"
        desc="Facial expression close-ups for use in UI feedback, chatbot states, and illustrations."
      >
        <MascotGrid assets={EXPRESSIONS} />
      </DocSection>
    </DocPage>
  );
}
