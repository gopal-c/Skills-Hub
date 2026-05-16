"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile, Seniority, Proficiency, Status, Skill, Project, Education } from "@/lib/store";

type Props = {
  profile: Profile;
  mode: "review" | "edit";
};

const SENIORITIES: Seniority[]   = ["junior", "mid", "senior", "lead"];
const PROFICIENCIES: Proficiency[] = ["beginner", "intermediate", "advanced", "expert"];

export function ProfileForm({ profile, mode }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName]                       = useState(profile.name);
  const [email, setEmail]                     = useState(profile.email);
  const [city, setCity]                       = useState(profile.city);
  const [seniority, setSeniority]             = useState<Seniority>(profile.seniority);
  const [yearsExperience, setYearsExperience] = useState<number>(profile.yearsExperience);
  const [skills, setSkills]                   = useState<Skill[]>(profile.skills);
  const [projects, setProjects]               = useState<Project[]>(profile.projects);
  const [education, setEducation]             = useState<Education[]>(profile.education);

  function buildPatch(extra: Partial<{ status: Status }> = {}) {
    return {
      name, email, city, seniority, yearsExperience,
      skills, projects, education,
      ...extra,
    };
  }

  function submit(patch: Record<string, unknown>, successMessage: string, target?: string) {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/profiles/${profile.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!data.ok) {
          toast.error(data.error ?? "Couldn't save.");
          return;
        }
        toast.success(successMessage);
        if (target) router.push(target);
        router.refresh();
      } catch {
        toast.error("Network error — try again.");
      }
    });
  }

  return (
    <div className="space-y-s-6">
      {/* Basics */}
      <Card>
        <CardHeader><CardTitle>Basics</CardTitle></CardHeader>
        <CardContent className="grid gap-s-4 md:grid-cols-2">
          <div className="space-y-s-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-s-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-s-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-s-2">
            <Label htmlFor="yrs">Years of experience</Label>
            <Input
              id="yrs"
              type="number"
              min={0}
              value={yearsExperience}
              onChange={(e) => setYearsExperience(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-s-2">
            <Label htmlFor="seniority">Seniority</Label>
            <Select value={seniority} onValueChange={(v) => setSeniority(v as Seniority)}>
              <SelectTrigger id="seniority"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SENIORITIES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader><CardTitle>Skills ({skills.length})</CardTitle></CardHeader>
        <CardContent className="space-y-s-3">
          {skills.length === 0 && (
            <p className="text-[13px] text-fg-2">No skills yet. Add one below.</p>
          )}
          {skills.map((s, i) => (
            <div key={i} className="grid grid-cols-1 items-end gap-s-2 sm:grid-cols-[1fr_120px_140px_90px_auto]">
              <Input
                placeholder="Skill name"
                value={s.name}
                onChange={(e) => {
                  const next = [...skills]; next[i] = { ...next[i], name: e.target.value }; setSkills(next);
                }}
              />
              <Input
                placeholder="Category"
                value={s.category}
                onChange={(e) => {
                  const next = [...skills]; next[i] = { ...next[i], category: e.target.value }; setSkills(next);
                }}
              />
              <Select
                value={s.proficiency}
                onValueChange={(v) => {
                  const next = [...skills]; next[i] = { ...next[i], proficiency: v as Proficiency }; setSkills(next);
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROFICIENCIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={0}
                placeholder="yrs"
                value={s.yearsExperience}
                onChange={(e) => {
                  const next = [...skills]; next[i] = { ...next[i], yearsExperience: Number(e.target.value) || 0 }; setSkills(next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSkills(skills.filter((_, j) => j !== i))}
                aria-label="Remove skill"
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSkills([...skills, { name: "", category: "other", proficiency: "intermediate", yearsExperience: 0 }])}
          >
            + Add skill
          </Button>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader><CardTitle>Projects ({projects.length})</CardTitle></CardHeader>
        <CardContent className="space-y-s-4">
          {projects.length === 0 && (
            <p className="text-[13px] text-fg-2">No projects yet. Add one below.</p>
          )}
          {projects.map((p, i) => (
            <div key={i} className="space-y-s-2 rounded-md border border-border-hairline p-s-3">
              <div className="grid gap-s-2 sm:grid-cols-[1fr_150px_auto]">
                <Input
                  placeholder="Project name"
                  value={p.name}
                  onChange={(e) => {
                    const next = [...projects]; next[i] = { ...next[i], name: e.target.value }; setProjects(next);
                  }}
                />
                <Input
                  placeholder="Duration"
                  value={p.duration}
                  onChange={(e) => {
                    const next = [...projects]; next[i] = { ...next[i], duration: e.target.value }; setProjects(next);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setProjects(projects.filter((_, j) => j !== i))}
                  aria-label="Remove project"
                >
                  ×
                </Button>
              </div>
              <Textarea
                placeholder="Description"
                rows={3}
                value={p.description}
                onChange={(e) => {
                  const next = [...projects]; next[i] = { ...next[i], description: e.target.value }; setProjects(next);
                }}
              />
              <Input
                placeholder="Skills used, comma-separated"
                value={p.skillsUsed.join(", ")}
                onChange={(e) => {
                  const next = [...projects];
                  next[i] = { ...next[i], skillsUsed: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) };
                  setProjects(next);
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setProjects([...projects, { name: "", description: "", skillsUsed: [], duration: "" }])}
          >
            + Add project
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader><CardTitle>Education ({education.length})</CardTitle></CardHeader>
        <CardContent className="space-y-s-3">
          {education.length === 0 && (
            <p className="text-[13px] text-fg-2">No education entries yet.</p>
          )}
          {education.map((e, i) => (
            <div key={i} className="grid items-end gap-s-2 sm:grid-cols-[1fr_1fr_100px_auto]">
              <Input
                placeholder="Degree"
                value={e.degree}
                onChange={(ev) => {
                  const next = [...education]; next[i] = { ...next[i], degree: ev.target.value }; setEducation(next);
                }}
              />
              <Input
                placeholder="Institution"
                value={e.institution}
                onChange={(ev) => {
                  const next = [...education]; next[i] = { ...next[i], institution: ev.target.value }; setEducation(next);
                }}
              />
              <Input
                type="number"
                placeholder="Year"
                value={e.year}
                onChange={(ev) => {
                  const next = [...education]; next[i] = { ...next[i], year: Number(ev.target.value) || 0 }; setEducation(next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEducation(education.filter((_, j) => j !== i))}
                aria-label="Remove education"
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEducation([...education, { degree: "", institution: "", year: new Date().getFullYear() }])}
          >
            + Add education
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-s-3 border-t border-border-hairline pt-s-5">
        {mode === "review" ? (
          <>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => submit({ status: "rejected" }, "Profile rejected.", "/review")}
            >
              Reject
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => submit(buildPatch(), "Changes saved.")}
            >
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => submit({ status: "approved" }, "Profile approved.", "/review")}
            >
              Approve
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => submit(buildPatch({ status: "approved" }), "Saved & approved.", "/review")}
            >
              Save &amp; approve
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/employees/${profile.id}`)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => submit(buildPatch(), "Changes saved.", `/employees/${profile.id}`)}
            >
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
