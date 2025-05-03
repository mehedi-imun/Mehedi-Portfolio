// app/components/Tools.tsx or wherever appropriate

interface ToolItem {
    name: string;
    icon: string;
  }
  
  interface ToolCategory {
    category: string;
    items: ToolItem[];
  }
  
  const tools: ToolCategory[] = [
    {
      category: "Frontend",
      items: [
        { name: "Next.js", icon: "⚛️" },
        { name: "React", icon: "⚛️" },
        { name: "TypeScript", icon: "📝" },
        { name: "Tailwind CSS", icon: "🎨" },
        { name: "Framer Motion", icon: "✨" },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", icon: "🟢" },
        { name: "Express", icon: "🚂" },
        { name: "MongoDB", icon: "🍃" },
        { name: "PostgreSQL", icon: "🐘" },
      ],
    },
    {
      category: "Tools",
      items: [
        { name: "Git", icon: "🔄" },
        { name: "GitHub", icon: "🐙" },
        { name: "VS Code", icon: "💻" },
        { name: "Figma", icon: "🎨" },
      ],
    },
  ];
  
  export default function Tools() {
    return (
      <section className=" max-w-7xl mx-auto px-4 lg:px-0 py-20" id="tools">
        <div className="page-container">
          <h2 className="section-heading">Tools & Technologies</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((toolCategory) => (
              <div key={toolCategory.category}>
                <h3 className="text-xl font-semibold mb-4">{toolCategory.category}</h3>
                <div className="bg-muted/30 rounded-lg p-6 h-full">
                  <ul className="space-y-3">
                    {toolCategory.items.map((tool) => (
                      <li key={tool.name} className="flex items-center">
                        <span className="mr-3 text-xl">{tool.icon}</span>
                        <span>{tool.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  