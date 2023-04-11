import { motion } from "framer-motion";

export function Spinner() {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="relative h-36 w-36 place-content-center rounded-full border-4 border-indigo-300 border-l-transparent border-t-transparent"
    ></motion.div>
  );
}
