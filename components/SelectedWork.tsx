"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const projects = [
  { id: 1, title: "الهوية البصرية", cat: "Brand Identity", img: "https://aurateam3.com/wp-content/uploads/2024/01/26-1.png" },
  { id: 2, title: "إدارة الحملات", cat: "Social Media", img: "https://aurateam3.com/wp-content/uploads/2022/06/8.png" },
  { id: 3, title: "تصميم واجهات", cat: "UI/UX Design", img: "https://aurateam3.com/wp-content/uploads/2022/07/WhatsApp-Image-2022-03-01-at-9.08.png" },
  { id: 4, title: "التصوير الإبداعي", cat: "Photography", img: "https://aurateam3.com/wp-content/uploads/2024/01/7-1.jpg" },
];

export default function SelectedWork() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={container} className="relative py-32 px-4 md:px-12 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-end gap-4 mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-[#0F172A] tracking-tighter">
            Selected Work
          </h2>
          <div className="h-4 w-4 rounded-full bg-[#58A8B4] mb-3 animate-pulse" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              style={{ y: i % 2 === 0 ? 0 : y }}
              className="group cursor-pointer"
            >
              <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#58A8B4]/20 transition-all duration-700 ease-out">
                
                <img 
                  src={project.img} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent pointer-events-none"></div>

                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="flex justify-end">
                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white">
                      ↗
                    </div>
                  </div>
                  <div>
                    <p className="text-white/80 font-medium tracking-widest text-sm uppercase mb-2">
                      {project.cat}
                    </p>
                    <h3 className="text-3xl md:text-4xl text-white font-bold">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
