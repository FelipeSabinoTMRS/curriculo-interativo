import React, { useRef, useLayoutEffect, useState } from "react";
import type { Resume } from '~/types';
import { Github, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ResumeViewerProps {
  resume: Resume;
  isDarkTheme?: boolean;
}

export default function ResumeViewer({ resume, isDarkTheme = false }: ResumeViewerProps) {
  const { personalInfo, experiences, education, skills, projects } = resume;
  const containerRef = useRef<HTMLDivElement>(null);
  const [marginBottom, setMarginBottom] = useState(0);

  /**
   * Calcula o fator de escala baseado na largura da viewport
   * Breakpoints correspondentes aos definidos no CSS do debug panel
   */
  function getScale(): number {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth <= 420) return 0.4;
    if (window.innerWidth <= 520) return 0.45;
    if (window.innerWidth <= 639) return 0.55;
    if (window.innerWidth <= 767) return 0.65;
    if (window.innerWidth <= 899) return 0.75;
    if (window.innerWidth <= 1023) return 0.85;
    return 1;
  }

  /**
   * Calcula e aplica margin-bottom negativo para compensar 
   * o espaço extra deixado pelo transform: scale()
   */
  useLayoutEffect(() => {
    function updateMargin() {
      const scale = getScale();
      if (containerRef.current) {
        const realHeight = containerRef.current.offsetHeight;
        const scaledHeight = realHeight * scale;
        setMarginBottom(-(realHeight - scaledHeight));
      }
    }

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, []);

  return (
    <div
      className="resume-container"
      style={{
        transform: `scale(${getScale()})`,
        transformOrigin: "top center",
        marginBottom: `${marginBottom}px`,
        transition: "transform 0.3s ease-in-out, margin-bottom 0.3s ease-in-out"
      }}
      ref={containerRef}
    >
      <div className="space-y-4">
        {/* Página 1 */}
        <div className={`resume-paper p-4 px-4 print:p-6 print:min-h-[297mm] ${isDarkTheme ? 'bg-gray-900 text-white print:bg-white print:text-black' : 'bg-white text-gray-900'}`}>
          {/* Header Section */}
          <div className="flex items-start gap-6 mb-8">
            {personalInfo.profileImage && (
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img 
                  src={personalInfo.profileImage} 
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${isDarkTheme ? 'text-white print:text-ai-dark-900' : 'text-ai-dark-900'}`}>
                {personalInfo.name}
              </h1>
              <h2 className={`text-xl mb-4 font-medium ${isDarkTheme ? 'text-blue-300 print:text-ai-blue-600' : 'text-ai-blue-600'}`}>
                {personalInfo.title}
              </h2>
              
              <div className={`flex flex-wrap gap-4 text-sm ${isDarkTheme ? 'text-gray-300 print:text-gray-600' : 'text-gray-600'}`}>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.location}</span>
                </div>
                {personalInfo.githubUrl && (
                  <div className="flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    <span>{personalInfo.githubUrl}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <section className="mb-8">
            <h3 className={`text-lg font-semibold mb-3 border-b pb-1 ${isDarkTheme ? 'text-white border-blue-400 print:text-ai-dark-900 print:border-ai-blue-200' : 'text-ai-dark-900 border-ai-blue-200'}`}>
              Resumo Profissional
            </h3>
            <p className={`leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>
              {personalInfo.summary}
            </p>
          </section>

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 border-b pb-1 ${isDarkTheme ? 'text-white border-blue-400 print:text-ai-dark-900 print:border-ai-blue-200' : 'text-ai-dark-900 border-ai-blue-200'}`}>
                Experiência Profissional
              </h3>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id || index} className={`border-l-2 pl-4 ${isDarkTheme ? 'border-blue-400 print:border-ai-blue-200' : 'border-ai-blue-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className={`font-semibold ${isDarkTheme ? 'text-white print:text-ai-dark-900' : 'text-ai-dark-900'}`}>{exp.position}</h4>
                        <p className={`font-medium ${isDarkTheme ? 'text-blue-300 print:text-ai-blue-600' : 'text-ai-blue-600'}`}>{exp.company}</p>
                      </div>
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-500' : 'text-gray-500'}`}>
                        {exp.startDate} - {exp.endDate || 'Presente'}
                      </span>
                    </div>
                    <p className={`mb-2 ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>{exp.description}</p>
                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className={`px-2 py-1 text-xs rounded ${isDarkTheme ? 'bg-blue-800 text-blue-200 print:bg-ai-blue-100 print:text-ai-blue-800' : 'bg-ai-blue-100 text-ai-blue-800'}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Página 2 */}
        <div className={`resume-paper p-4 px-4 print:p-6 print:min-h-[297mm] print:break-before-page ${isDarkTheme ? 'bg-gray-900 text-white print:bg-white print:text-black' : 'bg-white text-gray-900'}`}>
          {/* Header pequeno da página 2 */}
          <div className={`flex items-center justify-between mb-8 pb-4 border-b ${isDarkTheme ? 'border-blue-400 print:border-ai-blue-200' : 'border-ai-blue-200'}`}>
            <div>
              <h1 className={`text-xl font-bold ${isDarkTheme ? 'text-white print:text-ai-dark-900' : 'text-ai-dark-900'}`}>{personalInfo.name}</h1>
              <p className={`text-sm ${isDarkTheme ? 'text-blue-300 print:text-ai-blue-600' : 'text-ai-blue-600'}`}>{personalInfo.title}</p>
            </div>
            <div className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-500' : 'text-gray-500'}`}>Página 2</div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 border-b pb-1 ${isDarkTheme ? 'text-white border-blue-400 print:text-ai-dark-900 print:border-ai-blue-200' : 'text-ai-dark-900 border-ai-blue-200'}`}>
                Formação Acadêmica
              </h3>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className={`border-l-2 pl-4 ${isDarkTheme ? 'border-blue-400 print:border-ai-blue-200' : 'border-ai-blue-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-semibold ${isDarkTheme ? 'text-white print:text-ai-dark-900' : 'text-ai-dark-900'}`}>{edu.degree} em {edu.field}</h4>
                        <p className={`${isDarkTheme ? 'text-blue-300 print:text-ai-blue-600' : 'text-ai-blue-600'}`}>{edu.institution}</p>
                        {edu.description && (
                          <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>{edu.description}</p>
                        )}
                      </div>
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-500' : 'text-gray-500'}`}>
                        {edu.startDate} - {edu.endDate || 'Presente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 border-b pb-1 ${isDarkTheme ? 'text-white border-blue-400 print:text-ai-dark-900 print:border-ai-blue-200' : 'text-ai-dark-900 border-ai-blue-200'}`}>
                Habilidades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className={`font-medium mb-2 ${isDarkTheme ? 'text-gray-200 print:text-ai-dark-800' : 'text-ai-dark-800'}`}>{category}</h4>
                    <div className="space-y-2">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index} className="flex justify-between items-center">
                          <span className={`${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>{skill.name}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`w-2 h-2 rounded-full ${
                                  level <= skill.level 
                                    ? isDarkTheme ? 'bg-blue-400 print:bg-ai-blue-500' : 'bg-ai-blue-500'
                                    : isDarkTheme ? 'bg-gray-600 print:bg-gray-300' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 border-b pb-1 ${isDarkTheme ? 'text-white border-blue-400 print:text-ai-dark-900 print:border-ai-blue-200' : 'text-ai-dark-900 border-ai-blue-200'}`}>
                Projetos
              </h3>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={project.id || index} className={`border-l-2 pl-4 ${isDarkTheme ? 'border-blue-400 print:border-ai-blue-200' : 'border-ai-blue-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-semibold ${isDarkTheme ? 'text-white print:text-ai-dark-900' : 'text-ai-dark-900'}`}>{project.name}</h4>
                      <div className="flex gap-2">
                        {project.url && (
                          <Globe className={`w-4 h-4 ${isDarkTheme ? 'text-blue-400 print:text-ai-blue-600' : 'text-ai-blue-600'}`} />
                        )}
                        {project.githubUrl && (
                          <Github className={`w-4 h-4 ${isDarkTheme ? 'text-blue-400 print:text-ai-blue-600' : 'text-ai-blue-600'}`} />
                        )}
                      </div>
                    </div>
                    <p className={`mb-2 ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className={`px-2 py-1 text-xs rounded ${isDarkTheme ? 'bg-blue-800 text-blue-200 print:bg-ai-blue-100 print:text-ai-blue-800' : 'bg-ai-blue-100 text-ai-blue-800'}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
} 