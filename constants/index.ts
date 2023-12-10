import {
  Clapperboard,
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
} from 'lucide-react'

export const links = [
  { name: 'خانه', href: '/social', icon: Home },
  {
    name: 'جست‌وجو',
    href: '/social/search',
    icon: Search,
    hideOnMobile: true,
  },
  { name: 'کاوش', href: '/social/explore', icon: Compass },
  {
    name: 'حلقه‌ها',
    href: '/social/reels',
    icon: Clapperboard,
  },
  {
    name: 'پیام‌ها',
    href: '/social/messages',
    icon: MessageCircle,
  },
  {
    name: 'اعلانها',
    href: '/social/notifications',
    icon: Heart,
    hideOnMobile: true,
  },
  {
    name: 'ایجاد',
    href: '/social/create',
    icon: PlusSquare,
  },
]
