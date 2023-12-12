import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/fa-IR'

const formatDistanceLocale = {
  lessThanXSeconds: 'همین الان',
  xSeconds: 'همین الان',
  halfAMinute: 'همین الان',
  lessThanXMinutes: '{{count}} دقیقه',
  xMinutes: '{{count}} دقیقه',
  aboutXHours: '{{count}} ساعت',
  xHours: '{{count}} ساعت',
  xDays: '{{count}} روز',
  aboutXWeeks: '{{count}} هفته',
  xWeeks: '{{count}} هفته',
  aboutXMonths: '{{count}} ماه',
  xMonths: '{{count}} ماه',
  aboutXYears: '{{count}} سال',
  xYears: '{{count}} سال',
  overXYears: '{{count}} سال',
  almostXYears: '{{count}} سال',
}

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'در ' + result
    } else {
      if (result === 'همین الان') return result
      return result + ' پیش '
    }
  }

  return result
}

export function timestamp(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}
