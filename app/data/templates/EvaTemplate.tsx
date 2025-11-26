"use client";
import React from "react";

const EvaTemplate: React.FC = () => {
  return (
    // 🔥 DIV NGOÀI CÙNG PHẢI FULL RỘNG + NỀN TRẮNG
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans">
      {/* Khối content chính, canh giữa và giới hạn max-width */}
      <div className="max-w-6xl mx-auto px-4 lg:px-0 pt-6 pb-10">
        {/* Breadcrumb + title + meta */}
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-1">
            Tư vấn mặc đẹp / Thời trang sao
          </div>
          <h1 className="text-2xl font-bold leading-snug mb-2">
            4 kiểu giày dép phối với quần short là hợp nhất, diện lên vừa thoải
            mái lại không hề luộm thuộm
          </h1>
          <div className="text-[11px] text-slate-500 flex flex-wrap gap-2">
            <span>Bạc Hà</span>
            <span>| Ngày 26/02/2022 08:55 AM (GMT+7)</span>
            <span className="text-pink-600">Tư vấn mặc đẹp</span>
            <span className="text-pink-600">Thời trang</span>
          </div>
        </div>

        {/* MAIN LAYOUT: bài viết + sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Bài viết bên trái */}
          <main className="flex-1 lg:max-w-[720px]">
            <p className="text-sm leading-relaxed mb-4">
              Quần short luôn là một trong những hot item của mùa hè...
            </p>

            <h2 className="font-semibold mt-4 mb-2 text-base">
              Sandal quai mảnh
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              Kiểu dép sandal này chiếm trọn cảm tình của phái đẹp...
            </p>

            <div className="w-full mb-2">
              <img
                src="https://via.placeholder.com/900x500"
                alt="Fashion model sitting"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-[11px] text-center text-slate-500 mb-6">
              Sandal quai mảnh mang đến vẻ ngoài thanh thoát cho phái đẹp.
            </p>

            <h2 className="font-semibold mt-4 mb-2 text-base">
              Dép lê quai ngang bản to
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              Các quý cô đừng vội cho rằng diện dép lê với quần short...
            </p>

            {/* ... em tiếp tục thêm nội dung ở đây */}
          </main>

          {/* Sidebar bên phải */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* Tin tức thị trường */}
            <section className="border border-slate-200">
              <div className="bg-pink-700 text-white text-xs font-semibold px-3 py-2">
                TIN TỨC THỊ TRƯỜNG
              </div>
              <div className="bg-white divide-y divide-slate-100">
                <div className="flex gap-2 p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="w-[72px] h-[48px] bg-slate-200" />
                  <p className="text-[11px] leading-snug">
                    CEO 8X đam mê thời trang, mong muốn phụ nữ Việt tự tin tỏa
                    sáng
                  </p>
                </div>
                {/* ... các item khác */}
              </div>
            </section>

            {/* Sự kiện nổi bật */}
            <section className="border border-slate-200 bg-[#fff3e3] p-4 text-center">
              <h3 className="text-pink-700 font-bold text-sm mb-3">
                Sự kiện NỔI BẬT
              </h3>
              <ul className="text-[11px] text-left space-y-1 mb-3">
                <li>✨ Lễ Vu Lan 2022 - Đồng hành cùng áo</li>
                <li>✨ Kỷ niệm 21 năm báo</li>
                <li>✨ Nuôi con Đủ - Dạy con khôn</li>
                <li>✨ Vắc xin COVID-19</li>
              </ul>
              <div className="w-[120px] h-[140px] bg-slate-300 mx-auto" />
              <p className="text-[10px] text-slate-500 mt-1">Quảng cáo</p>
            </section>

            {/* Ad 300x250 */}
            <section className="border border-slate-200 h-[250px] flex items-center justify-center text-[11px] text-slate-400">
              300x250 Ad Space
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EvaTemplate;
