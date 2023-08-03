import { Guild } from '../../shared/types.shared';

import AlgoPng from '../assets/images/guilds/32bit_algo.png';
import ClusterPng from '../assets/images/guilds/32bit_cluster.png';
import DatePng from '../assets/images/guilds/32bit_date.png';
import DigitPng from '../assets/images/guilds/32bit_digit.png';
import OtitPng from '../assets/images/guilds/32bit_otit.png';
import TikPng from '../assets/images/guilds/32bit_tik.png';
import TitePng from '../assets/images/guilds/32bit_tite.png';
import TuttiPng from '../assets/images/guilds/32bit_tutti.png';

export const GUILD_IMAGES: { [key in Guild]: string } = {
  algo: AlgoPng,
  cluster: ClusterPng,
  date: DatePng,
  digit: DigitPng,
  otit: OtitPng,
  tik: TikPng,
  tite: TitePng,
  tutti: TuttiPng,
};
