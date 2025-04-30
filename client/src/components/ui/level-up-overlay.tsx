import { motion } from "framer-motion";
import { StatReward } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface LevelUpOverlayProps {
  newLevel: number;
  statIncreases: StatReward[];
  onContinue: () => void;
}

export default function LevelUpOverlay({ 
  newLevel, 
  statIncreases, 
  onContinue
}: LevelUpOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center px-8"
      >
        <motion.h2 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="text-4xl md:text-6xl font-bold font-display text-amber-500 glow-text mb-4"
        >
          LEVEL UP!
        </motion.h2>
        
        <p className="text-2xl md:text-4xl font-display text-white mb-6">
          You reached <span className="text-primary glow-text">Level {newLevel}</span>
        </p>
        
        <div className="flex justify-center space-x-8 mb-8">
          {statIncreases.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="text-center"
            >
              <p className="text-sm text-gray-400">{stat.category}</p>
              <p className="text-xl text-primary">+{stat.amount}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button 
            onClick={onContinue}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded transition-all"
          >
            CONTINUE
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
