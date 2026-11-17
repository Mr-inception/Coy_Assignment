"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const THRESHOLD = 110;

export function CardFace({ profile }) {
  return (
    <>
      <img src={profile.photo} alt={profile.name} draggable={false} />
      <div className="card-info">
        <h2>{profile.name}, {profile.age}</h2>
        <div className="city">📍 {profile.city}</div>
        <p>{profile.bio}</p>
        <div className="chips">
          {profile.interests.map((i) => (
            <span className="chip" key={i}>{i}</span>
          ))}
        </div>
      </div>
    </>
  );
}

const SwipeCard = forwardRef(function SwipeCard({ profile, onSwiped }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const likeOpacity = useTransform(x, [20, THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-THRESHOLD, -20], [1, 0]);
  const done = useRef(false);

  const fling = (dir) => {
    if (done.current) return; // ignore double swipes
    done.current = true;
    animate(x, dir * 600, {
      duration: 0.28,
      ease: "easeIn",
      onComplete: () => onSwiped(profile, dir > 0 ? "like" : "pass"),
    });
  };

  useImperativeHandle(ref, () => ({ swipe: fling }));

  return (
    <motion.div
      className="card"
      style={{ x, rotate }}
      drag="x"
      dragMomentum={false}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (done.current) return;
        if (info.offset.x > THRESHOLD) fling(1);
        else if (info.offset.x < -THRESHOLD) fling(-1);
        else animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      }}
    >
      <CardFace profile={profile} />
      <motion.div className="stamp like" style={{ opacity: likeOpacity }}>LIKE</motion.div>
      <motion.div className="stamp nope" style={{ opacity: nopeOpacity }}>NOPE</motion.div>
    </motion.div>
  );
});

export default SwipeCard;