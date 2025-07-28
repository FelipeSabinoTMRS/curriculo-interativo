import React from 'react';
import type { Resume } from '~/types';
import { Github, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ResumeViewerProps {
  resume: Resume;
}

export default function ResumeViewer({ resume }: ResumeViewerProps) {
  const { personalInfo, experiences, education, skills, projects } = resume;

  return (
    <div className="resume-container">
      <div className="space-y-8">
        {/* Página 1 */}
        <div className="resume-paper p-8 print:p-6 print:min-h-[297mm]">
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
              <h1 className="text-3xl font-bold text-ai-dark-900 mb-2">
                {personalInfo.name}
              </h1>
              <h2 className="text-xl text-ai-blue-600 mb-4 font-medium">
                {personalInfo.title}
              </h2>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
            <h3 className="text-lg font-semibold text-ai-dark-900 mb-3 border-b border-ai-blue-200 pb-1">
              Resumo Profissional
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </section>

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-ai-dark-900 mb-4 border-b border-ai-blue-200 pb-1">
                Experiência Profissional
              </h3>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id || index} className="border-l-2 border-ai-blue-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-ai-dark-900">{exp.position}</h4>
                        <p className="text-ai-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {exp.startDate} - {exp.endDate || 'Presente'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{exp.description}</p>
                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-ai-blue-100 text-ai-blue-800 text-xs rounded"
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
        <div className="resume-paper p-8 print:p-6 print:min-h-[297mm] print:break-before-page">
          {/* Header pequeno da página 2 */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-ai-blue-200">
            <div>
              <h1 className="text-xl font-bold text-ai-dark-900">{personalInfo.name}</h1>
              <p className="text-sm text-ai-blue-600">{personalInfo.title}</p>
            </div>
            <div className="text-sm text-gray-500">Página 2</div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-ai-dark-900 mb-4 border-b border-ai-blue-200 pb-1">
                Formação Acadêmica
              </h3>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="border-l-2 border-ai-blue-200 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-ai-dark-900">{edu.degree} em {edu.field}</h4>
                        <p className="text-ai-blue-600">{edu.institution}</p>
                        {edu.description && (
                          <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
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
              <h3 className="text-lg font-semibold text-ai-dark-900 mb-4 border-b border-ai-blue-200 pb-1">
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
                    <h4 className="font-medium text-ai-dark-800 mb-2">{category}</h4>
                    <div className="space-y-2">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index} className="flex justify-between items-center">
                          <span className="text-gray-700">{skill.name}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`w-2 h-2 rounded-full ${
                                  level <= skill.level 
                                    ? 'bg-ai-blue-500' 
                                    : 'bg-gray-300'
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
              <h3 className="text-lg font-semibold text-ai-dark-900 mb-4 border-b border-ai-blue-200 pb-1">
                Projetos
              </h3>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={project.id || index} className="border-l-2 border-ai-blue-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-ai-dark-900">{project.name}</h4>
                      <div className="flex gap-2">
                        {project.url && (
                          <Globe className="w-4 h-4 text-ai-blue-600" />
                        )}
                        {project.githubUrl && (
                          <Github className="w-4 h-4 text-ai-blue-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-ai-blue-100 text-ai-blue-800 text-xs rounded"
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