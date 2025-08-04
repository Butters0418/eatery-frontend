// React 相關
import { useEffect, useState, useCallback, useRef } from 'react';

// 第三方庫
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Hooks
import { useProductQuery } from '../../../hooks/useProductQuery';

// Utils
import useWindowScroll from '../../../utils/useWindowScroll';

// 頂部導航組件 (手機版置頂滑動錨點)
function TopNav() {
  // ===== API 相關 Hooks =====
  const { isLoading, isSuccess } = useProductQuery();

  // ===== State =====
  const [categoryContainer, setCategoryContainer] = useState<Element[]>([]);
  const [currentContainer, setCurrentContainer] = useState<string | null>(null);

  // ===== Custom Hooks =====
  const scroll = useWindowScroll();

  // ===== Refs =====
  const nav = useRef<HTMLDivElement>(null);

  // ===== 回調函數 =====
  const updateCategoryContainer = useCallback(() => {
    const allContainer = Array.from(
      document.querySelectorAll('[data-category]'),
    );
    if (allContainer.length !== 0) setCategoryContainer(allContainer);
  }, []);

  // ===== 事件處理函數 =====
  // 滑動到錨點區塊
  const scrollToElement = (target: string) => {
    const scroll = window.scrollY;
    const targetCategory = document.querySelector(
      `[data-category="${target}"]`,
    );
    if (targetCategory) {
      const h = targetCategory.getBoundingClientRect().top + scroll - 40;
      window.scrollTo({ top: h, behavior: 'smooth' });
    }
  };

  // ===== Effects =====
  // dom observer
  useEffect(() => {
    if (!isSuccess) return;

    let observer: MutationObserver | undefined;
    // 資料載入成功後，執行一次更新
    updateCategoryContainer();

    // 只有在第一次找不到類別容器時才啟動 MutationObserver
    if (categoryContainer.length === 0) {
      observer = new MutationObserver(() => {
        updateCategoryContainer();
        // 如果已找到類別，立即停止監控
        if (document.querySelectorAll('[data-category]').length > 0) {
          observer?.disconnect();
        }
      });

      const config = { childList: true, subtree: true };
      observer.observe(document.body, config);

      // 2 秒後停止觀察
      const timerDisconnect = setTimeout(() => {
        observer?.disconnect();
      }, 1000);

      return () => clearTimeout(timerDisconnect);
    }

    // 清理函數
    return () => {
      if (observer) observer.disconnect();
    };
  }, [isSuccess, updateCategoryContainer, categoryContainer.length]);

  // 滾動監聽作用中的區塊
  useEffect(() => {
    const targetContainer = categoryContainer.find((item) => {
      return (
        item.getBoundingClientRect().top < 200 &&
        item.getBoundingClientRect().bottom > 200
      );
    });
    const targetCategory =
      targetContainer?.getAttribute('data-category') || null;
    if (targetCategory !== currentContainer) {
      setCurrentContainer(targetCategory);
    }
  }, [scroll, categoryContainer, currentContainer]);

  useEffect(() => {
    const currentNav = [...document.querySelectorAll('[data-nav]')].find(
      (item) => {
        return currentContainer === (item as HTMLElement).dataset.nav;
      },
    );
    if (currentNav !== undefined && nav.current) {
      nav.current.scrollTo({
        left: (currentNav as HTMLElement).offsetLeft - 5,
        behavior: 'smooth',
      });
    }
  }, [currentContainer]);

  // ===== 渲染 UI =====
  return (
    <div className="sticky top-0 z-50 bg-white px-2 shadow-sm">
      <div
        className="no-scrollbar container mx-auto h-9 max-w-[1280px] overflow-scroll md:h-12"
        ref={nav}
      >
        {isLoading ? (
          <Skeleton
            count={3}
            className="h-full w-1/3"
            containerClassName="p-1 flex justify-center gap-x-2 item-center h-full"
          />
        ) : (
          <ul className="flex">
            {categoryContainer.map((item) => {
              const category = item.getAttribute('data-category');
              return (
                <li
                  data-nav={category}
                  key={category}
                  className="flex-[100px] shrink-0 p-1"
                >
                  <button
                    className={`w-full rounded-md py-1 text-center text-sm md:text-lg ${
                      currentContainer === category
                        ? 'bg-primary text-white duration-100'
                        : ''
                    }`}
                    onClick={() => {
                      scrollToElement(category!);
                    }}
                  >
                    {category}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TopNav;
