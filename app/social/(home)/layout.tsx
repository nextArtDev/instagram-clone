import Header from '@/components/share/Header'

function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default HomePageLayout
