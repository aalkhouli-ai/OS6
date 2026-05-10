import React, { useState } from 'react';
import { DeliveryTask } from '../types';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Package,
  Calendar,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// --- بيانات تجريبية (Mock Data) لعرض التصميم ---
const MOCK_DATA: DeliveryTask[] = [
  { Task_Status: 'Completed', Driver_Name: 'أحمد محمود', Rating: 'ممتاز', Customer_Comment: 'توصيل سريع وممتاز', Customer_Name: 'خالد عبدالله', Customer_Phone: '0501234567', Ticket_Status: 'تم الحل', Team_Name: 'مستودع الرياض', Creation_DateTime: '2023-10-25T10:00:00' },
  { Task_Status: 'InProgress', Driver_Name: 'سعد فهد', Rating: 'متوسط', Customer_Comment: 'تأخر قليلاً', Customer_Name: 'محمد علي', Customer_Phone: '0507654321', Ticket_Status: 'معلقة', Team_Name: 'مستودع جدة', Creation_DateTime: '2023-10-25T11:30:00' },
  { Task_Status: 'Cancelled', Driver_Name: 'فيصل عبدالرحمن', Rating: 'سيء', Customer_Comment: 'المندوب لم يتصل', Customer_Name: 'سارة فهد', Customer_Phone: '0501112223', Ticket_Status: 'معلقة', Team_Name: 'مستودع الدمام', Creation_DateTime: '2023-10-25T09:15:00' },
  { Task_Status: 'Completed', Driver_Name: 'عمر ياسر', Rating: 'ممتاز', Customer_Comment: 'خدمة احترافية', Customer_Name: 'نورة محمد', Customer_Phone: '0509998887', Ticket_Status: 'تم الحل', Team_Name: 'مستودع الرياض', Creation_DateTime: '2023-10-26T14:20:00' },
  { Task_Status: 'Suspended', Driver_Name: 'ياسر القحطاني', Rating: 'متوسط', Customer_Comment: 'الطلب ناقص', Customer_Name: 'عبدالعزيز صالح', Customer_Phone: '0505554443', Ticket_Status: 'معلقة', Team_Name: 'مستودع مكة', Creation_DateTime: '2023-10-26T16:45:00' },
  { Task_Status: 'Failed', Driver_Name: 'فهد محمد', Rating: 'سيء', Customer_Comment: 'العميل لم يستلم', Customer_Name: 'تركي العتيبي', Customer_Phone: '0555443322', Ticket_Status: 'معلقة', Team_Name: 'مستودع جدة', Creation_DateTime: '2023-10-26T18:00:00' },
];

// --- بيانات الرسم البياني ---
const chartData = [
  { name: '1 أكتوبر', رحلات: 120 },
  { name: '5 أكتوبر', رحلات: 250 },
  { name: '10 أكتوبر', رحلات: 180 },
  { name: '15 أكتوبر', رحلات: 300 },
  { name: '20 أكتوبر', رحلات: 280 },
  { name: '25 أكتوبر', رحلات: 420 },
  { name: '30 أكتوبر', رحلات: 380 },
];

// --- دوال مساعدة لتلوين الحالات برمجياً ---
const getStatusColor = (status: DeliveryTask['Task_Status']) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'InProgress': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Suspended': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'Delayed': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

const getStatusLabel = (status: DeliveryTask['Task_Status']) => {
  switch (status) {
    case 'Completed': return 'تم التوصيل';
    case 'InProgress': return 'جاري التوصيل';
    case 'Suspended': return 'معلقة';
    case 'Cancelled': return 'ملغية';
    case 'Delayed': return 'متأخرة';
    case 'Failed': return 'فشل التوصيل';
    default: return status;
  }
};

// --- نافذة منبثقة مخصصة للرسم البياني ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-xl border border-slate-100">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-emerald-600 font-semibold">
          {payload[0].value} رحلة
        </p>
      </div>
    );
  }
  return null;
};

export function Dashboard({ data }: { data?: DeliveryTask[] }) {
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday'>('all');

  // استخدام البيانات الحقيقية إذا توفرت، أو التجريبية
  const displayData = data && data.length > 0 ? data : MOCK_DATA;

  // حساب الإحصائيات
  const stats = {
    total: displayData.length,
    completed: displayData.filter(d => d.Task_Status === 'Completed').length,
    inProgress: displayData.filter(d => d.Task_Status === 'InProgress').length,
    suspended: displayData.filter(d => d.Task_Status === 'Suspended').length,
    cancelled: displayData.filter(d => d.Task_Status === 'Cancelled').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* === 1. قسم الفلاتر والترويسة === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">لوحة تحكم التوصيل</h1>
            <p className="text-slate-500 text-sm mt-1">نظرة عامة على أداء العمليات والرحلات</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setDateFilter('today')} export function Dashboard
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${dateFilter === 'today' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                اليوم فقط
              </button>
              <button
                onClick={() => setDateFilter('yesterday')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${dateFilter === 'yesterday' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                أمس
              </button>
              <button
                onClick={() => setDateFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${dateFilter === 'all' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                الكل
              </button>
            </div>

            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>تحديد فترة</span>
            </button>
          </div>
        </div>

        {/* فلاتر الحالات (Checkboxes) */}
        <div className="flex flex-wrap gap-3">
          {['تم التوصيل', 'جاري التوصيل', 'رحلات متأخرة', 'فشل التوصيل'].map((filter) => (
            <label key={filter} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all select-none">
              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 w-4 h-4 cursor-pointer" />
              <span className="text-sm font-medium text-slate-700">{filter}</span>
            </label>
          ))}
        </div>

        {/* === 2. بطاقات المؤشرات العلوية (KPIs) === */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">إجمالي الرحلات</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">تم التوصيل</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.completed}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">جاري التوصيل</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.inProgress}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">مواعيد معلقة</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.suspended}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">رحلات ملغية</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.cancelled}</h3>
            </div>
          </div>
        </div>

        {/* === 3. شبكة البيانات والجداول (Data Grid) === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* جدول أداء المستودعات */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-1 flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">أداء المستودعات</h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="py-3 px-4 font-medium">المستودع</th>
                    <th className="py-3 px-4 font-medium">الطلبات</th>
                    <th className="py-3 px-4 font-medium w-1/3">الضغط</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'مستودع الرياض', orders: 145, load: 85 },
                    { name: 'مستودع جدة', orders: 90, load: 50 },
                    { name: 'مستودع الدمام', orders: 45, load: 20 },
                    { name: 'مستودع مكة', orders: 60, load: 45 },
                  ].map((wh, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-700">{wh.name}</td>
                      <td className="py-4 px-4 text-slate-600">{wh.orders}</td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${wh.load > 75 ? 'bg-rose-500' : wh.load > 40 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                            style={{ width: `${wh.load}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* تقييم السائقين */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">تقييم السائقين</h3>
              <div className="flex gap-4 text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Smile className="w-4 h-4" /> <span>85%</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                  <Frown className="w-4 h-4" /> <span>5%</span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="py-3 px-5 font-medium">السائق</th>
                    <th className="py-3 px-5 font-medium">التقييم</th>
                    <th className="py-3 px-5 font-medium">التعليق</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.filter(d => d.Rating).slice(0, 4).map((d, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5 font-medium text-slate-800">{d.Driver_Name}</td>
                      <td className="py-4 px-5">
                        {d.Rating === 'ممتاز' && <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"><Smile className="w-4 h-4" /> ممتاز</span>}
                        {d.Rating === 'متوسط' && <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100"><Meh className="w-4 h-4" /> متوسط</span>}
                        {d.Rating === 'سيء' && <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100"><Frown className="w-4 h-4" /> سيء</span>}
                      </td>
                      <td className="py-4 px-5 text-slate-500 max-w-[200px] truncate" title={d.Customer_Comment}>
                        {d.Customer_Comment || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* === 4. الرسوم البيانية وتذاكر العملاء === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* مخطط مساحي (Area Chart) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">الرحلات خلال الشهر</h3>
                <p className="text-sm text-slate-500 mt-1">نظرة عامة على إجمالي الرحلات المنفذة</p>
              </div>
            </div>
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="رحلات"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTrips)"
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* تذاكر العملاء والتلوين المبرمج */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-1 flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">حالة التذاكر والطلبات</h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="py-3 px-4 font-medium">العميل</th>
                    <th className="py-3 px-4 font-medium">حالة الطلب</th>
                    <th className="py-3 px-4 font-medium">التذكرة</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((d, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{d.Customer_Name}</p>
                        <p className="text-xs text-slate-500 mt-0.5" dir="ltr">{d.Customer_Phone}</p>
                      </td>
                      <td className="py-3 px-4">
                        {/* استخدام دالة الألوان لتلوين حالة الطلب برمجياً */}
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(d.Task_Status)}`}>
                          {getStatusLabel(d.Task_Status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                          ${d.Ticket_Status === 'تم الحل'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200'}`}
                        >
                          {d.Ticket_Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
