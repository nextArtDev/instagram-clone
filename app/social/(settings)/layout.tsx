import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const tabs = [
  { title: 'ویرایش پروفایل', value: 'edit-profile' },
  { title: 'Professional account', value: 'professional-account' },
  { title: 'نوتیفیکیشن‌ها', value: 'notifications' },
  { title: 'Privacy and security', value: 'privacy-and-security' },
  { title: 'Login activity', value: 'login-activity' },
  { title: 'Emails from Instagram', value: 'emails-from-instagram' },
]

function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Tabs
        defaultValue="edit-profile"
        className="hidden w-[200] min-h-screen fixed space-y-8 left-0 top-0  h-full sm:flex flex-col lg:border-r px-6 py-12"
        orientation="vertical"
      >
        <h4 className="font-extrabold text-xl text-white ml-1">تنظیمات</h4>
        <TabsList className="flex flex-col items-start justify-start h-full bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              dir="rtl"
              key={tab.value}
              value={tab.value}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                ' data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-neutral-800 dark:hover:bg-neutral-900 w-full justify-start !px-3 text-right text-xs sm:text-sm md:text-base '
              )}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex-1 sm:ml-[200px] md:ml-32 min-h-screen bg-white dark:bg-neutral-950">
        {children}
      </div>
    </div>
  )
}

export default SettingsLayout
