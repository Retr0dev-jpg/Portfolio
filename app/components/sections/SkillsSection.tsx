import AnimatedSection from '../ui/AnimatedSection';

export default function SkillsSection() {
  return (
    <AnimatedSection id="skills" title="" variant="up" showTitle={false} className="bg-accent !min-h-[550px] flex items-center justify-center !w-full !max-w-none">
      <div className="max-w-6xl mx-auto">
        <div className="skills-grid">
          {/* Frontend Card */}
          <div id="skill-frontend" className="skill-card">
            <div className="skill-card-content">
              <div className="relative w-20 h-20 mt-auto">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="absolute top-1 left-1 w-7 h-7 transition-all duration-300 icon-top-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" alt="Angular" className="absolute top-1 right-1 w-7 h-7 transition-all duration-300 icon-top-right" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="absolute bottom-1 left-1 w-7 h-7 transition-all duration-300 icon-bottom-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="absolute bottom-1 right-1 w-7 h-7 transition-all duration-300 icon-bottom-right" draggable="false" />
              </div>
              <span className="skill-name">Frontend</span>
            </div>
          </div>
          
          {/* Backend Card */}
          <div id="skill-backend" className="skill-card">
            <div className="skill-card-content">
              <div className="relative w-20 h-20 mt-auto">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="absolute top-1 left-1 w-8 h-8 transition-all duration-300 icon-top-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" alt="Go" className="absolute top-1 right-1 w-8 h-8 transition-all duration-300 icon-top-right" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" alt="Django" className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 transition-all duration-300 z-10 icon-bottom-center" draggable="false" />
              </div>
              <span className="skill-name">Backend</span>
            </div>
          </div>
          
          {/* Hosting Card */}
          <div id="skill-hosting" className="skill-card">
            <div className="skill-card-content">
              <div className="relative w-20 h-20 mt-auto">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" alt="WordPress" className="absolute top-1 left-1 w-7 h-7 transition-all duration-300 icon-top-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" alt="Nginx" className="absolute top-1 right-1 w-7 h-7 transition-all duration-300 icon-top-right" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" alt="Apache" className="absolute bottom-1 left-1 w-7 h-7 transition-all duration-300 icon-bottom-left" draggable="false" />
                <img src="/hostinger-icon.svg" alt="Hostinger" className="absolute bottom-1 right-1 w-7 h-7 transition-all duration-300 icon-bottom-right" draggable="false" />
              </div>
              <span className="skill-name">Hosting</span>
            </div>
          </div>
          
          {/* C Family Card */}
          <div id="skill-cfamily" className="skill-card">
            <div className="skill-card-content">
              <div className="relative w-20 h-20 mt-auto">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C" className="absolute top-1 left-1 w-8 h-8 transition-all duration-300 icon-top-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" className="absolute top-1 right-1 w-8 h-8 transition-all duration-300 icon-top-right" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" alt="C#" className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 transition-all duration-300 z-10 icon-bottom-center" draggable="false" />
              </div>
              <span className="skill-name">C Family</span>
            </div>
          </div>
          
          {/* PHP */}
          <div id="skill-php" className="skill-card">
            <div className="skill-card-content">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP" className="skill-icon" />
              <span className="skill-name">PHP</span>
            </div>
          </div>
          
          {/* Java */}
          <div id="skill-java" className="skill-card">
            <div className="skill-card-content">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" className="skill-icon" />
              <span className="skill-name">Java</span>
            </div>
          </div>
          
          {/* Databases */}
          <div id="skill-databases" className="skill-card">
            <div className="skill-card-content">
              <div className="relative w-20 h-20 mt-auto">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" className="absolute top-1 left-1 w-9 h-9 transition-all duration-300 icon-top-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="absolute bottom-1 right-1 w-9 h-9 transition-all duration-300 icon-bottom-right" draggable="false" />
              </div>
              <span className="skill-name">Databases</span>
            </div>
          </div>
          
          {/* Python */}
          <div id="skill-python" className="skill-card">
            <div className="skill-card-content">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="skill-icon" />
              <span className="skill-name">Python</span>
            </div>
          </div>
          
          {/* Git */}
          <div id="skill-git" className="skill-card">
            <div className="skill-card-content">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="skill-icon" />
              <span className="skill-name">Git</span>
            </div>
          </div>
          
          {/* Cloud */}
          <div id="skill-cloud" className="skill-card">
            <div className="skill-card-content">
              <div className="relative w-20 h-20 mt-auto">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className="absolute top-1 left-1 w-9 h-9 transition-all duration-300 icon-top-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" className="absolute bottom-1 right-1 w-9 h-9 transition-all duration-300 icon-bottom-right" draggable="false" />
              </div>
              <span className="skill-name">Cloud</span>
            </div>
          </div>
          
          {/* VS Code */}
          <div id="skill-vscode" className="skill-card">
            <div className="skill-card-content">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" className="skill-icon" />
              <span className="skill-name">VS Code</span>
            </div>
          </div>
          
          {/* Containers */}
          <div id="skill-containers" className="skill-card">
            <div className="skill-card-content">
              <div className="relative w-20 h-20 mt-auto">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="absolute top-1 left-1 w-9 h-9 transition-all duration-300 icon-top-left" draggable="false" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg" alt="Kubernetes" className="absolute bottom-1 right-1 w-9 h-9 transition-all duration-300 icon-bottom-right" draggable="false" />
              </div>
              <span className="skill-name">Containers</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
