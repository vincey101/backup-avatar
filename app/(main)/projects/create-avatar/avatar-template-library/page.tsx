'use client';

import TemplateSelection from '@/components/avatar/AvatarTemplateLibrary';
import { useRouter } from 'next/navigation';

export default function AvatarTemplateLibraryPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // or router.push to a specific route
  };

  return <TemplateSelection onBack={handleBack} />;
}
