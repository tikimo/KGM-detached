// https://pixelarticons.com/free/
import { ReactComponent as RepeatIcon } from './assets/icons/repeat.svg';
import { ReactComponent as Hourglass } from './assets/icons/hourglass.svg';
import { ReactComponent as Scale } from './assets/icons/scale.svg';
import { ReactComponent as Trophy } from './assets/icons/trophy.svg';
import { ReactComponent as Checkbox } from './assets/icons/checkbox.svg';
import { ReactComponent as CheckboxEmpty } from './assets/icons/checkbox-empty.svg';
import { ReactComponent as Logout } from './assets/icons/logout.svg';
import { ReactComponent as Questionmark } from './assets/icons/questionmark.svg';
import { ReactComponent as Bus } from './assets/icons/bus.svg';
import { ReactComponent as Back } from './assets/icons/back.svg';
import { ReactComponent as Next } from './assets/icons/next.svg';

const ICONS = {
  checkbox: Checkbox,
  checkboxEmpty: CheckboxEmpty,
  repeat: RepeatIcon,
  hourglass: Hourglass,
  trophy: Trophy,
  scale: Scale,
  logout: Logout,
  questionmark: Questionmark,
  bus: Bus,
  back: Back,
  next: Next,
};

type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  color?: string;
  size?: number | `${number}px` | `${number}rem` | `${number}%`;
} & React.SVGProps<SVGSVGElement>;

export const Icon = ({
  name,
  size = '2rem',
  color = '#1aff00',
  ...props
}: IconProps) => {
  const Component = ICONS[name];
  return <Component color={color} height={size} width={size} {...props} />;
};
