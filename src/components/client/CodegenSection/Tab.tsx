import { Tab, Tooltip } from '@mui/material';

import { LANG_ICONS } from '@/constants';
import { LangTabProps, ReadonlyFC } from '@/types';

const LangTab: ReadonlyFC<LangTabProps> = ({ lang }) => {
  const Icon = LANG_ICONS[lang];
  const label = lang.replace('_', ' ');
  const iconNode = Icon ? (
    <Tooltip title={label} arrow placement="top">
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Icon size={16} />
      </span>
    </Tooltip>
  ) : undefined;
  const labelNode = !Icon ? (
    <Tooltip title={label} arrow placement="top">
      <span>{label}</span>
    </Tooltip>
  ) : undefined;
  return (
    <Tab
      key={lang}
      value={lang}
      icon={iconNode}
      label={labelNode}
      iconPosition="start"
      aria-label={label}
    />
  );
};

export default LangTab;
