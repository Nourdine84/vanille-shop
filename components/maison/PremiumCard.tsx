"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { colors, radii, shadows } from "@/lib/design-tokens";

type BaseProps = {
  title: string;
  description: string;
  href?: string;
};

type IconCardProps = BaseProps & {
  variant: "icon";
  icon: ReactNode;
};

type ImageCardProps = BaseProps & {
  variant: "image";
  image: string;
};

export type PremiumCardProps = IconCardProps | ImageCardProps;

/**
 * Carte réutilisable pour "La Maison Vanille'Or" (Nos engagements,
 * Notre qualité, Nos producteurs...). Deux variantes : icône ou image.
 */
export default function PremiumCard(props: PremiumCardProps) {
  const Wrapper = props.href ? motion.a : motion.div;

  return (
    <Wrapper
      {...(props.href ? { href: props.href } : {})}
      style={card}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {props.variant === "image" ? (
        <div style={imageWrap}>
          <img src={props.image} alt="" style={imageStyle} />
        </div>
      ) : (
        <div style={iconWrap} aria-hidden="true">
          {props.icon}
        </div>
      )}

      <h3 style={title}>{props.title}</h3>
      <p style={description}>{props.description}</p>
    </Wrapper>
  );
}

const card: React.CSSProperties = {
  display: "block",
  background: colors.white,
  borderRadius: radii.card,
  padding: "30px",
  boxShadow: shadows.card,
  textDecoration: "none",
  color: "inherit",
  height: "100%",
};

const imageWrap: React.CSSProperties = {
  borderRadius: radii.soft,
  overflow: "hidden",
  marginBottom: "20px",
  aspectRatio: "4 / 3",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const iconWrap: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: radii.soft,
  background: colors.goldSoft,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.gold,
  marginBottom: "20px",
};

const title: React.CSSProperties = {
  fontSize: "17px",
  fontWeight: 800,
  color: colors.ink,
  marginBottom: "10px",
};

const description: React.CSSProperties = {
  fontSize: "14.5px",
  color: colors.textMuted,
  lineHeight: 1.7,
};
