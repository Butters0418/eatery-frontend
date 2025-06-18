import style from '@emotion/styled';
export const SMainSwiper = style.div`
  .main-swiper-pagination {
    display: flex;
    justify-content: center;
    width:auto;
    position: absolute;
    left: 50%;
    bottom:0%;
    transform: translateX(-50%);
    .swiper-pagination-bullet {
      width: 12px;
      height: 12px;
      &.swiper-pagination-bullet-active {
        background-color: #FF7629;
      }
      @media (max-width: 768px) {
        width: 10px;
        height: 10px;
      }
    }
  }
`;
