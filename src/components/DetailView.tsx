import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Copy, Check, Heart, ShieldAlert, Star } from 'lucide-react';
import { ORIGINAL_PROFILE_DATA } from '../data/profileData';
import { copyToClipboard } from '../utils/audioSynthesizer';

interface DetailViewProps {
  category: string;
  onBackToSelection: () => void;
  onSwitchCategory: (cat: string) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  category,
  onBackToSelection,
  onSwitchCategory,
}) => {
  const data = ORIGINAL_PROFILE_DATA;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedContact, setCopiedContact] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  const handleCopyScript = async (quote: string, id: string) => {
    const ok = await copyToClipboard(quote);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyContact = async () => {
    const contactStr = `${data.contactWeChatOrQQ} (${data.contactUid})`;
    const ok = await copyToClipboard(contactStr);
    if (ok) {
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2500);
    }
  };

  const handleToggleLike = (id: string, initialLikes: number) => {
    setLikesMap(prev => {
      const cur = prev[id] !== undefined ? prev[id] : initialLikes;
      const isIncremented = cur > initialLikes;
      return {
        ...prev,
        [id]: isIncremented ? initialLikes : initialLikes + 1,
      };
    });
  };

  const navTabs = [
    { key: 'rules', labelEn: 'RULES', labelCn: '须知' },
    { key: 'board', labelEn: 'BOARD', labelCn: '板评' },
    { key: 'scripts', labelEn: 'SCRIPTS', labelCn: '话术' },
    { key: 'companion', labelEn: 'COMPANION', labelCn: '陪评' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in space-y-4 font-light">
      {/* Top Header & Sub-Category Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={onBackToSelection}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-light text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-3.5 py-2 rounded-lg border border-neutral-300/80 dark:border-neutral-700 transition-all cursor-pointer self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
          <span>BACK TO CATEGORIES / 返回目录</span>
        </button>

        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700/80 overflow-x-auto text-xs font-mono font-light">
          {navTabs.map(tab => {
            const isTabActive = tab.key === category;
            return (
              <button
                key={tab.key}
                onClick={() => onSwitchCategory(tab.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
                  isTabActive
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <span>{tab.labelEn}</span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-sans">
                  ({tab.labelCn})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-white dark:bg-[#121316] rounded-xl border border-neutral-300/70 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-colors duration-200 p-6 sm:p-8">
        {/* 1. RULES (须知) */}
        {category === 'rules' && (
          <div className="space-y-4">
            <div className="pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                  SECTION 01 · MANDATORY
                </span>
                <h1 className="text-lg sm:text-xl font-normal text-neutral-950 dark:text-white tracking-wider uppercase font-serif">
                  RULES & GUIDELINES / 相处须知
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                  相处规范与预约边界说明 · 双方尊重与安全底线
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {data.notices.map((notice, idx) => (
                <div
                  key={notice.title}
                  className="p-4 sm:p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-left"
                >
                  <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-2 flex items-center gap-2 font-serif">
                    <span className="w-5 h-5 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-[10px] font-mono font-light">
                      0{idx + 1}
                    </span>
                    <span>{notice.title}</span>
                  </h2>

                  <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300 pl-7 list-disc list-outside">
                    {notice.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-300 text-xs flex items-center gap-2.5 text-left font-mono">
              <ShieldAlert className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>NOTICE: 本服务为纯绿色虚拟情感陪伴，不涉及任何线下违规接触与现实借贷。</span>
            </div>
          </div>
        )}

        {/* 2. BOARD (板评) */}
        {category === 'board' && (
          <div className="space-y-4">
            <div className="pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                  SECTION 02 · COMMUNITY
                </span>
                <h1 className="text-lg sm:text-xl font-normal text-neutral-950 dark:text-white tracking-wider uppercase font-serif">
                  BOARD REVIEWS / 体验板评
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                  全平台客户单次与阶段性真实反馈 · 实时互动
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {data.boardReviews.map(review => {
                const currentLikes = likesMap[review.id] !== undefined ? likesMap[review.id] : review.likes;
                const isLiked = currentLikes > review.likes;

                return (
                  <div
                    key={review.id}
                    className="p-4 sm:p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-left space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-mono text-xs">
                          {review.clientName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <span>{review.clientName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                              #{review.tag}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {review.date}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
                        ★ ★ ★ ★ ★
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                      {review.content}
                    </p>

                    {review.reply && (
                      <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300 font-mono">
                        <span className="text-neutral-900 dark:text-white font-medium">痕：</span>
                        <span>{review.reply.replace('痕回复：', '')}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400">
                      <button
                        onClick={() => handleToggleLike(review.id, review.likes)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer ${
                          isLiked
                            ? 'text-neutral-950 dark:text-white bg-neutral-200 dark:bg-neutral-700'
                            : 'hover:text-neutral-950 dark:hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                        <span>{currentLikes} ENDORSEMENTS</span>
                      </button>

                      <span className="text-[10px]">VERIFIED REVIEW</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. SCRIPTS (话术) */}
        {category === 'scripts' && (
          <div className="space-y-4">
            <div className="pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                  SECTION 03 · AUDIO & TONE
                </span>
                <h1 className="text-lg sm:text-xl font-normal text-neutral-950 dark:text-white tracking-wider uppercase font-serif">
                  SPEECH SCRIPTS / 经典话术
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                  实战对话金句与声线风格展示 · 情绪推拉
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {data.scripts.map(script => (
                <div
                  key={script.id}
                  className="p-4 sm:p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-left space-y-2"
                >
                  <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                    <span className="text-neutral-900 dark:text-white font-medium font-serif">
                      {script.category} · {script.title}
                    </span>
                    <span className="text-[10px]">{script.tone}</span>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-serif leading-relaxed italic pl-1">
                    “{script.quote}”
                  </blockquote>

                  <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-end">
                    <button
                      onClick={() => handleCopyScript(script.quote, script.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-mono hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      {copiedId === script.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制台词</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. COMPANION (陪评) */}
        {category === 'companion' && (
          <div className="space-y-4">
            <div className="pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                  SECTION 04 · IN-DEPTH
                </span>
                <h1 className="text-lg sm:text-xl font-normal text-neutral-950 dark:text-white tracking-wider uppercase font-serif">
                  COMPANION REVIEWS / 结契陪评
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                  长期包周/包月深层结契客户全纪录与反馈
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {data.companionReviews.map(review => {
                const currentLikes = likesMap[review.id] !== undefined ? likesMap[review.id] : review.likes;
                const isLiked = currentLikes > review.likes;

                return (
                  <div
                    key={review.id}
                    className="p-4 sm:p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-left space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-mono text-xs">
                          {review.clientName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <span>{review.clientName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                              #{review.tag}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {review.date}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
                        ★ ★ ★ ★ ★
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                      {review.content}
                    </p>

                    {review.reply && (
                      <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300 font-mono">
                        <span className="text-neutral-900 dark:text-white font-medium">痕：</span>
                        <span>{review.reply.replace('痕：', '')}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400">
                      <button
                        onClick={() => handleToggleLike(review.id, review.likes)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer ${
                          isLiked
                            ? 'text-neutral-950 dark:text-white bg-neutral-200 dark:bg-neutral-700'
                            : 'hover:text-neutral-950 dark:hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                        <span>{currentLikes} ENDORSEMENTS</span>
                      </button>

                      <span className="text-[10px]">DEEP BONDING VERIFIED</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* External KDocs link banner */}
        {data.categories.find(c => c.key === category) && (
          <div className="pt-4">
            <a
              href={data.categories.find(c => c.key === category)?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>OPEN OFFICIAL KDOCS / 打开金山文档云端原档</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* PPT Dotted Rule with Solid Marker (Matching Image 1) */}
        <div className="my-5 relative flex items-center justify-center">
          <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700"></div>
          <div className="absolute w-12 h-1 bg-neutral-900 dark:bg-white rounded-full"></div>
        </div>

        {/* Bottom Contact Copy Bar */}
        <div className="pt-1 text-center">
          <button
            onClick={handleCopyContact}
            className="px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-mono font-light inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            {copiedContact ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>已复制联系方式到剪贴板</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>一键复制联系方式：企鹅/V: {data.contactWeChatOrQQ} ({data.contactUid})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
