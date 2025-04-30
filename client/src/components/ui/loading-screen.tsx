import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold font-display text-primary glow-text mb-4">ARISE</h1>
        <p className="text-lg font-display text-primary/80 mb-8">PERSONAL GROWTH SYSTEM</p>
        
        <div className="relative w-48 h-1 bg-black/30 rounded overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 left-0 h-full bg-primary"
          />
        </div>
        
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-4 text-sm text-muted-foreground"
        >
          INITIALIZING SYSTEM...
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-4 text-xs text-muted-foreground">
        <span>Powered by ARISE Personal Growth System</span>
      </div>
    </div>
  );
}
