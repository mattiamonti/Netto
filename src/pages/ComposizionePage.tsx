import { useInvestments } from "@/hooks/useInvestments"
import PortfolioComposition from "@/components/PortfolioComposition"
import { PageTransition } from "@/components/PageTransition"

export default function ComposizionePage() {
  const { investments } = useInvestments()

  return (
    <PageTransition>
      <PortfolioComposition investments={investments} />
    </PageTransition>
  )
}
