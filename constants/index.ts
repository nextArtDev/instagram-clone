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
  { name: 'کاوش', href: '/social/explore', icon: Compass, hideOnMobile: true },
  {
    name: 'فیلم‌ها',
    href: '/social/reels',
    // href: '/social',
    icon: Clapperboard,
    hideOnMobile: true,
  },
  {
    name: 'پیام‌ها',
    href: '/social/messages',
    // href: '/social',
    icon: MessageCircle,
    hideOnMobile: true,
  },
  {
    name: 'اعلانها',
    href: '/social/notifications',
    // href: '/social',
    icon: Heart,
    hideOnMobile: true,
  },
  {
    name: 'ایجاد',
    href: '/social/create',
    icon: PlusSquare,
  },
]
