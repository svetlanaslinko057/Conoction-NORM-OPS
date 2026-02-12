/**
 * Early Signal Radar - CLEAN UI VERSION
 * 
 * Single focus point on chart + account list for selection
 * Light theme as requested
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw,
  ChevronRight,
  X,
  Check
} from 'lucide-react';
import { 
  IconRadar, 
  IconSpikePump, 
  IconAttention, 
  IconTarget,
  IconIgnition
} from '../components/icons/FomoIcons';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

// ============================================================
// TOOLTIP COMPONENT
// ============================================================

const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-flex items-center">
      <div 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// COMPONENTS
// ============================================================

const EarlySignalBadge = ({ badge, size = 'md', showTooltip = false }) => {
  const badges = {
    breakout: { 
      label: 'Breakout', 
      IconComp: IconSpikePump, 
      className: 'bg-green-500 text-white',
      tooltip: 'High momentum account showing rapid growth in influence and engagement. Potential alpha opportunity.'
    },
    rising: { 
      label: 'Rising', 
      IconComp: IconIgnition, 
      className: 'bg-amber-500 text-white',
      tooltip: 'Account with positive acceleration trend. Worth monitoring for potential breakout.'
    },
    none: { 
      label: 'None', 
      IconComp: IconTarget, 
      className: 'bg-gray-200 text-gray-600',
      tooltip: 'No significant signal detected. Account is stable or declining.'
    },
  };
  const config = badges[badge] || badges.none;
  const BadgeIcon = config.IconComp;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  const content = (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${config.className}`}>
      <BadgeIcon size={size === 'sm' ? 12 : 14} />
      <span>{config.label}</span>
    </span>
  );
  
  if (showTooltip) {
    return <Tooltip content={config.tooltip}>{content}</Tooltip>;
  }
  return content;
};

const ProfileBadge = ({ profile, showTooltip = false }) => {
  const profiles = {
    retail: { 
      label: 'Retail', 
      className: 'bg-blue-100 text-blue-700',
      tooltip: 'Regular trader/user with moderate following. Often early adopters of trends.'
    },
    influencer: { 
      label: 'Influencer', 
      className: 'bg-purple-100 text-purple-700',
      tooltip: 'High-reach account with significant audience. Their signals often move markets.'
    },
    whale: { 
      label: 'Whale', 
      className: 'bg-indigo-100 text-indigo-700',
      tooltip: 'Major player with very high influence. Typically VCs, founders, or large traders.'
    },
  };
  const config = profiles[profile] || profiles.retail;
  
  const content = (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
  
  if (showTooltip) {
    return <Tooltip content={config.tooltip}>{content}</Tooltip>;
  }
  return content;
};

const RiskBadge = ({ level, showTooltip = false }) => {
  const risks = {
    low: { 
      className: 'bg-green-100 text-green-700',
      tooltip: 'Low risk account with consistent behavior and reliable track record.'
    },
    medium: { 
      className: 'bg-amber-100 text-amber-700',
      tooltip: 'Moderate risk. Some volatility in engagement or mixed signal history.'
    },
    high: { 
      className: 'bg-red-100 text-red-700',
      tooltip: 'High risk. Suspicious patterns, bot activity, or unreliable predictions.'
    },
  };
  const config = risks[level] || risks.low;
  
  const content = (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${config.className}`}>
      {level}
    </span>
  );
  
  if (showTooltip) {
    return <Tooltip content={config.tooltip}>{content}</Tooltip>;
  }
  return content;
};

// ============================================================
// SINGLE FOCUS CHART - Clean, readable
// ============================================================

const FocusChart = ({ account }) => {
  if (!account) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center h-[300px]">
        <p className="text-gray-400">Select an account from the list →</p>
      </div>
    );
  }

  const WIDTH = 400;
  const HEIGHT = 300;
  const PADDING = 60;
  
  // Position on chart
  const accel = account.trend?.acceleration_norm || 0;
  const influence = account.influence_adjusted || 500;
  
  const x = PADDING + ((accel + 1) / 2) * (WIDTH - 2 * PADDING);
  const y = HEIGHT - PADDING - (influence / 1000) * (HEIGHT - 2 * PADDING);
  
  const isBreakout = account.early_signal?.badge === 'breakout';
  const isRising = account.early_signal?.badge === 'rising';
  const color = isBreakout ? '#22c55e' : isRising ? '#f59e0b' : '#6b7280';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-bold text-lg text-gray-900">@{account.username}</h3>
          <Tooltip content="This chart shows the account's position based on Influence Score (Y-axis) and Acceleration (X-axis). The green 'ALPHA' zone indicates high-potential accounts.">
            <IconAttention size={16} className="text-gray-400 hover:text-gray-600" />
          </Tooltip>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <ProfileBadge profile={account.profile} showTooltip />
          <EarlySignalBadge badge={account.early_signal?.badge} size="sm" showTooltip />
        </div>
      </div>
      
      <svg width={WIDTH} height={HEIGHT} className="mx-auto">
        {/* Background */}
        <rect x={PADDING} y={PADDING} width={WIDTH - 2*PADDING} height={HEIGHT - 2*PADDING} 
              fill="#f8fafc" stroke="#e2e8f0" rx={8} />
        
        {/* Grid */}
        <line x1={WIDTH/2} y1={PADDING} x2={WIDTH/2} y2={HEIGHT-PADDING} stroke="#e2e8f0" strokeDasharray="4,4" />
        <line x1={PADDING} y1={HEIGHT/2} x2={WIDTH-PADDING} y2={HEIGHT/2} stroke="#e2e8f0" strokeDasharray="4,4" />
        
        {/* Alpha Zone indicator */}
        <rect x={WIDTH/2 + 20} y={PADDING + 10} width={WIDTH/2 - PADDING - 30} height={80} 
              fill="#22c55e" opacity={0.1} rx={4} />
        <text x={WIDTH - PADDING - 10} y={PADDING + 30} textAnchor="end" fill="#22c55e" fontSize={10} fontWeight={600}>
          ALPHA
        </text>
        
        {/* Labels */}
        <text x={WIDTH/2} y={HEIGHT - 15} textAnchor="middle" fill="#64748b" fontSize={11}>
          ← Slowing | Acceleration | Growing →
        </text>
        <text x={15} y={HEIGHT/2} textAnchor="middle" fill="#64748b" fontSize={11} 
              transform={`rotate(-90, 15, ${HEIGHT/2})`}>
          Influence Score
        </text>
        
        {/* The single focus point */}
        <circle cx={x} cy={y} r={16} fill={color} opacity={0.9} />
        <circle cx={x} cy={y} r={20} fill="none" stroke={color} strokeWidth={2} strokeDasharray="4,2" />
        
        {/* Avatar initial */}
        <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize={12} fontWeight={700}>
          {account.username?.charAt(0)?.toUpperCase()}
        </text>
        
        {/* Score label */}
        <rect x={x - 25} y={y - 40} width={50} height={20} rx={4} fill={color} />
        <text x={x} y={y - 26} textAnchor="middle" fill="white" fontSize={11} fontWeight={600}>
          {account.early_signal?.score || 0}
        </text>
      </svg>
      
      {/* Stats below chart */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <Tooltip content="Combined influence score factoring in followers, engagement quality, and historical accuracy. Higher is better.">
          <div className="bg-gray-50 rounded-lg p-2 cursor-help">
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              Influence <IconAttention size={12} />
            </div>
            <div className="font-bold text-gray-900">{account.influence_adjusted}</div>
            <div className="text-xs text-green-600">+{account.influence_adjusted - account.influence_base}</div>
          </div>
        </Tooltip>
        <Tooltip content="Rate of change in influence. Positive = growing influence, Negative = declining. Values > 0.3 indicate strong momentum.">
          <div className="bg-gray-50 rounded-lg p-2 cursor-help">
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              Acceleration <IconAttention size={12} />
            </div>
            <div className={`font-bold ${accel > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {accel > 0 ? '+' : ''}{accel.toFixed(2)}
            </div>
          </div>
        </Tooltip>
        <Tooltip content="Risk assessment based on bot activity, suspicious patterns, and prediction accuracy.">
          <div className="bg-gray-50 rounded-lg p-2 cursor-help">
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              Risk <IconAttention size={12} />
            </div>
            <RiskBadge level={account.risk_level} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

// ============================================================
// ACCOUNT LIST - Clean, selectable
// ============================================================

const AccountList = ({ accounts, selectedId, onSelect, onViewProfile }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Accounts ({accounts.length})</h3>
        <Tooltip content="Select an account to view its position on the radar chart. Click the eye icon to view full profile.">
          <IconAttention size={16} className="text-gray-400 hover:text-gray-600" />
        </Tooltip>
      </div>
      <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
        {accounts.map(account => {
          const isSelected = selectedId === account.author_id;
          
          return (
            <div
              key={account.author_id}
              onClick={() => onSelect(account.author_id)}
              className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
              }`}
            >
              {/* Avatar */}
              {account.avatar ? (
                <img src={account.avatar} alt="" className="w-10 h-10 rounded-full object-cover"
                     onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {account.username?.charAt(0)?.toUpperCase()}
                </div>
              )}
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">@{account.username}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <ProfileBadge profile={account.profile} />
                  {account.followers && (
                    <span className="text-xs text-gray-500">{(account.followers / 1000).toFixed(0)}K</span>
                  )}
                </div>
              </div>
              
              {/* Signal */}
              <div className="text-right">
                <EarlySignalBadge badge={account.early_signal?.badge} size="sm" />
                <div className="text-xs text-gray-500 mt-1">
                  Score: {account.early_signal?.score || 0}
                </div>
              </div>
              
              {/* View button */}
              <button
                onClick={(e) => { e.stopPropagation(); onViewProfile(account.username); }}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                title="View Profile"
              >
                <IconAttention size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// TABLE VIEW
// ============================================================

const TableView = ({ accounts, selectedId, onSelect, onViewProfile }) => {
  const [sortBy, setSortBy] = useState('early_signal');
  const [sortDir, setSortDir] = useState('desc');

  const sortedData = useMemo(() => {
    return [...accounts].sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'early_signal': aVal = a.early_signal?.score || 0; bVal = b.early_signal?.score || 0; break;
        case 'acceleration': aVal = a.trend?.acceleration_norm || 0; bVal = b.trend?.acceleration_norm || 0; break;
        case 'influence': aVal = a.influence_adjusted || 0; bVal = b.influence_adjusted || 0; break;
        default: return 0;
      }
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [accounts, sortBy, sortDir]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('influence')}>
              Influence {sortBy === 'influence' && (sortDir === 'desc' ? '↓' : '↑')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('early_signal')}>
              Signal {sortBy === 'early_signal' && (sortDir === 'desc' ? '↓' : '↑')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('acceleration')}>
              Accel {sortBy === 'acceleration' && (sortDir === 'desc' ? '↓' : '↑')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sortedData.map(account => (
            <tr key={account.author_id} 
                onClick={() => onSelect(account.author_id)}
                className={`cursor-pointer ${selectedId === account.author_id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {account.avatar ? (
                    <img src={account.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {account.username?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-900">@{account.username}</span>
                    {account.followers && (
                      <div className="text-xs text-gray-500">{(account.followers / 1000).toFixed(0)}K followers</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><ProfileBadge profile={account.profile} /></td>
              <td className="px-4 py-3">
                <span className="text-gray-400 text-sm">{account.influence_base}</span>
                <span className="text-gray-300 mx-1">→</span>
                <span className="font-bold text-gray-900">{account.influence_adjusted}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <EarlySignalBadge badge={account.early_signal?.badge} size="sm" />
                  <span className="text-sm text-gray-500">{account.early_signal?.score}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`font-mono text-sm ${
                  (account.trend?.acceleration_norm || 0) > 0.3 ? 'text-green-600 font-medium' : 
                  (account.trend?.acceleration_norm || 0) < -0.3 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {(account.trend?.acceleration_norm || 0) > 0 ? '+' : ''}{(account.trend?.acceleration_norm || 0).toFixed(2)}
                </span>
              </td>
              <td className="px-4 py-3"><RiskBadge level={account.risk_level} /></td>
              <td className="px-4 py-3">
                <button onClick={(e) => { e.stopPropagation(); onViewProfile(account.username); }}
                        className="text-gray-400 hover:text-blue-500">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================

const ConnectionsEarlySignalPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('radar');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  
  const [filters, setFilters] = useState({
    profiles: [],
    badges: [],  // Show all by default
    hideHighRisk: false,
  });

  const handleViewProfile = (username) => {
    navigate(`/connections/influencers/${username}`);
  };

  const handleAccountSelect = (accountId) => {
    setSelectedAccountId(selectedAccountId === accountId ? null : accountId);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/connections/radar/accounts?limit=100`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAccounts(data.data?.accounts || []);
      // Auto-select first account
      if (data.data?.accounts?.length > 0 && !selectedAccountId) {
        setSelectedAccountId(data.data.accounts[0].author_id);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedAccountId]);

  useEffect(() => { fetchData(); }, []);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      if (filters.profiles.length > 0 && !filters.profiles.includes(acc.profile)) return false;
      if (filters.badges.length > 0 && !filters.badges.includes(acc.early_signal?.badge)) return false;
      if (filters.hideHighRisk && acc.risk_level === 'high') return false;
      return true;
    });
  }, [accounts, filters]);

  const selectedAccount = useMemo(() => {
    return accounts.find(a => a.author_id === selectedAccountId);
  }, [accounts, selectedAccountId]);

  const stats = useMemo(() => {
    const breakouts = filteredAccounts.filter(a => a.early_signal?.badge === 'breakout').length;
    const rising = filteredAccounts.filter(a => a.early_signal?.badge === 'rising').length;
    return { breakouts, rising, total: filteredAccounts.length };
  }, [filteredAccounts]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <IconRadar size={24} className="text-green-500" />
                Early Signal Radar
              </h1>
              <Tooltip content="The Early Signal Radar identifies accounts showing unusual growth patterns before they become mainstream. High influence + positive acceleration = potential alpha.">
                <IconAttention size={18} className="text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Identify accounts before they become significant</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {/* Stats */}
            <Tooltip content="Breakout: High momentum accounts with strong growth. Rising: Accounts with positive acceleration worth monitoring.">
              <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-white rounded-lg border border-gray-200 cursor-help">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="font-bold text-gray-900">{stats.breakouts}</span>
                  <span className="text-gray-500 text-xs md:text-sm">Breakout</span>
                </div>
                <div className="w-px h-4 bg-gray-200"></div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-bold text-gray-900">{stats.rising}</span>
                  <span className="text-gray-500 text-xs md:text-sm">Rising</span>
                </div>
              </div>
            </Tooltip>

            {/* View toggle */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={() => setView('radar')}
                      className={`px-2 md:px-3 py-1.5 rounded text-xs md:text-sm font-medium flex items-center gap-1.5 ${
                        view === 'radar' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                <IconRadar size={16} /> Radar
              </button>
              <button onClick={() => setView('table')}
                      className={`px-2 md:px-3 py-1.5 rounded text-xs md:text-sm font-medium flex items-center gap-1.5 ${
                        view === 'table' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                <IconTarget size={16} /> Table
              </button>
            </div>

            {/* Refresh */}
            <button onClick={fetchData} disabled={loading}
                    className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                    title="Refresh data">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Tooltip content="Filter by account type: Retail (regular users), Influencer (high reach), Whale (major players)">
          <span className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1 cursor-help flex-shrink-0">
            Profile: <IconAttention size={12} />
          </span>
        </Tooltip>
        {['retail', 'influencer', 'whale'].map(p => (
          <button key={p}
                  onClick={() => setFilters(f => ({ ...f, profiles: f.profiles.includes(p) ? f.profiles.filter(x => x !== p) : [...f.profiles, p] }))}
                  className={`px-2 md:px-3 py-1 rounded text-xs font-medium flex-shrink-0 ${
                    filters.profiles.includes(p) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        <div className="w-px h-4 bg-gray-200 hidden md:block"></div>
        <Tooltip content="Filter by signal strength: Breakout (strong momentum), Rising (positive growth)">
          <span className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1 cursor-help flex-shrink-0">
            Signal: <IconAttention size={12} />
          </span>
        </Tooltip>
        <button onClick={() => setFilters(f => ({ ...f, badges: f.badges.includes('breakout') ? f.badges.filter(x => x !== 'breakout') : [...f.badges, 'breakout'] }))}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                  filters.badges.includes('breakout') ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
          <IconSpikePump size={12} /> Breakout
        </button>
        <button onClick={() => setFilters(f => ({ ...f, badges: f.badges.includes('rising') ? f.badges.filter(x => x !== 'rising') : [...f.badges, 'rising'] }))}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                  filters.badges.includes('rising') ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
          <IconIgnition size={12} /> Rising
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : view === 'radar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left: Focus Chart */}
          <FocusChart account={selectedAccount} />
          
          {/* Right: Account List */}
          <AccountList 
            accounts={filteredAccounts}
            selectedId={selectedAccountId}
            onSelect={handleAccountSelect}
            onViewProfile={handleViewProfile}
          />
        </div>
      ) : (
        <TableView
          accounts={filteredAccounts}
          selectedId={selectedAccountId}
          onSelect={handleAccountSelect}
          onViewProfile={handleViewProfile}
        />
      )}
    </div>
  );
};

export default ConnectionsEarlySignalPage;
