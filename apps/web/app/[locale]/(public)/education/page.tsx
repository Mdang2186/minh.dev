import { EducationPageClient } from "@/components/sections/education/education-page-client";
import { getPublicEducations, getPublicCertifications, getPublicSiteProfile } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function EducationPage() {
  const [profile, educations, certifications] = await Promise.all([
    getPublicSiteProfile(),
    getPublicEducations(),
    getPublicCertifications(),
  ]);
  
  return (
    <EducationPageClient 
      profile={profile} 
      educations={educations} 
      certifications={certifications} 
    />
  );
}
