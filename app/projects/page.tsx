import type { Metadata } from "next";

import { ProjectFilters } from "@/components/projects/ProjectFilters";

export const metadata: Metadata = {
  title: "Six Agent Architecture Case Studies",
  description: "Browse six ordered Google ADK and Python projects by architecture pattern."
};

export default function ProjectsPage() {
  return (
    <div className="page-shell page-top projects-page">
      <header className="page-masthead">
        <p className="eyebrow">PROJECT INDEX · ACT → CONNECT</p>
        <h1>Six systems. Six different control models.</h1>
        <p className="lede">
          These are not six versions of the same chatbot. Each project adds a missing engineering layer and changes
          who controls the work, what the system can access and how results can be verified.
        </p>
      </header>
      <ProjectFilters />
    </div>
  );
}
