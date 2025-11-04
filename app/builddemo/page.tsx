"use client";
import React from "react";
import Icon from "../icons/Icons";
import {
  AD_VIEW_OPTIONS,
  TEMPLATE_OPTIONS,
  AD_FORMAT_OPTIONS,
  LOGO_OPTIONS,
} from "../data/data";

// const BuildDemo: React.FC = () => {
//   return (
//     <div className="bg-slate-800 rounded-lg shadow-lg p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-white">Build Demo</h1>
//           <p className="text-sm text-slate-400">
//             Create a new demo environment
//           </p>
//         </div>
//       </div>

//       <form className="space-y-6 max-w-lg">
//         <div>
//           <label
//             htmlFor="brandName"
//             className="block text-sm font-medium text-slate-300 mb-2"
//           >
//             Brand Name
//           </label>
//           <input
//             type="text"
//             id="brandName"
//             name="brandName"
//             required
//             className="w-full pl-4 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             placeholder="e.g., carrier-junior"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="hostEnv"
//             className="block text-sm font-medium text-slate-300 mb-2"
//           >
//             Host Environment
//           </label>
//           <select
//             id="hostEnv"
//             name="hostEnv"
//             className="w-full pl-4 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-no-repeat bg-right"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
//               backgroundPosition: "right 0.5rem center",
//               backgroundSize: "1.5em 1.5em",
//             }}
//           >
//             <option>demo</option>
//             <option>stage</option>
//             <option>prod</option>
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="format"
//             className="block text-sm font-medium text-slate-300 mb-2"
//           >
//             Format
//           </label>
//           <input
//             type="text"
//             id="format"
//             name="format"
//             required
//             className="w-full pl-4 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             placeholder="e.g., firstview"
//           />
//         </div>

//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
//           >
//             Create Demo
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// const BuildDemo: React.FC = () => {
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert("Form submitted!");
//   };

//   const handleReset = () => {
//     // In a real app, you'd reset form state here.
//     alert("Form reset!");
//   };

//   const handleCopy = () => {
//     // In a real app, copy content of textarea to clipboard.
//     alert("Copied to clipboard!");
//   };

//   const handleOpen = () => {
//     // In a real app, open the link in a new tab.
//     alert("Opening in new tab!");
//   };

//   const SelectInput: React.FC<{
//     label: string;
//     options: string[];
//     defaultValue: string;
//     isPlaceholder?: boolean;
//   }> = ({ label, options, defaultValue, isPlaceholder }) => (
//     <div>
//       <label
//         htmlFor={label}
//         className="block text-sm font-medium text-slate-300 mb-2"
//       >
//         {label}
//       </label>
//       <select
//         id={label}
//         name={label}
//         defaultValue={isPlaceholder ? "" : defaultValue}
//         className="w-full pl-4 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
//           backgroundPosition: "right 0.5rem center",
//           backgroundSize: "1.5em 1.5em",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         {isPlaceholder && (
//           <option value="" disabled>
//             {defaultValue}
//           </option>
//         )}
//         {!isPlaceholder && <option value={defaultValue}>{defaultValue}</option>}
//         {options.map((opt) => (
//           <option key={opt}>{opt}</option>
//         ))}
//       </select>
//     </div>
//   );

//   return (
//     <div className="bg-slate-800 rounded-lg shadow-lg p-6">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-white">Ad Formats Demo Form</h1>
//         <p className="text-sm text-slate-400 mt-1">
//           Choose required options to generate an ad format demo link.
//         </p>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="lg:w-2/3">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <SelectInput
//               label="Ad View"
//               options={["Option 1", "Option 2"]}
//               defaultValue="Please select an option ..."
//               isPlaceholder
//             />
//             <SelectInput
//               label="Template"
//               options={["Template A", "Template B"]}
//               defaultValue="None"
//             />
//             <SelectInput
//               label="Ad Format"
//               options={["Format X", "Format Y"]}
//               defaultValue="None"
//             />
//             <SelectInput
//               label="Logo"
//               options={["Logo 1", "Logo 2"]}
//               defaultValue="None"
//             />

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Source
//               </label>
//               <div className="flex items-center space-x-2">
//                 <select
//                   className="pl-4 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
//                   style={{
//                     backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
//                     backgroundPosition: "right 0.5rem center",
//                     backgroundSize: "1.5em 1.5em",
//                     backgroundRepeat: "no-repeat",
//                   }}
//                   defaultValue="Demo"
//                 >
//                   <option>Demo</option>
//                   <option>Stage</option>
//                   <option>Prod</option>
//                 </select>
//                 <div className="relative flex-grow">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                     <Icon name="link" className="w-5 h-5 text-slate-400" />
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="source here ..."
//                     className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <button
//                   type="button"
//                   className="flex items-center space-x-2 border border-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md text-sm hover:bg-slate-700"
//                 >
//                   <Icon name="externalLink" className="w-4 h-4" />
//                   <span>OUTPUT SOURCE</span>
//                 </button>
//                 <div className="flex space-x-2">
//                   <button
//                     type="button"
//                     onClick={handleCopy}
//                     className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
//                   >
//                     <Icon name="copy" className="w-4 h-4" />
//                     <span>COPY</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleOpen}
//                     className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
//                   >
//                     <Icon name="externalLink" className="w-4 h-4" />
//                     <span>OPEN IN NEW TAB</span>
//                   </button>
//                 </div>
//               </div>
//               <textarea
//                 rows={4}
//                 disabled
//                 className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-md text-sm text-slate-400 resize-none cursor-not-allowed"
//               />
//             </div>

//             <div className="flex justify-between items-center pt-4">
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
//                 >
//                   <Icon name="paperPlane" className="w-5 h-5" />
//                   <span>SUBMIT</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
//                 >
//                   <Icon name="reset" className="w-5 h-5" />
//                   <span>RESET</span>
//                 </button>
//               </div>
//               <button
//                 type="button"
//                 className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
//               >
//                 CONVERSION
//               </button>
//             </div>
//           </form>
//         </div>
//         <div className="lg:w-1/3">
//           <label className="block text-sm font-medium text-slate-300 mb-2">
//             Template Preview
//           </label>
//           <div className="w-full h-64 bg-slate-700 rounded-md flex flex-col items-center justify-center text-slate-500">
//             <Icon name="image" className="w-16 h-16 mb-4" />
//             <p className="font-semibold">No Preview Available</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const BuildDemo: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted!");
  };

  const handleReset = () => {
    // In a real app, you'd reset form state here.
    alert("Form reset!");
  };

  const handleCopy = () => {
    // In a real app, copy content of textarea to clipboard.
    alert("Copied to clipboard!");
  };

  const handleOpen = () => {
    // In a real app, open the link in a new tab.
    alert("Opening in new tab!");
  };

  const SelectInput: React.FC<{
    label: string;
    options: string[];
    defaultValue: string;
    isPlaceholder?: boolean;
  }> = ({ label, options, defaultValue, isPlaceholder }) => (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        {label}
      </label>
      <select
        id={label}
        name={label}
        defaultValue={isPlaceholder ? "" : defaultValue}
        className="w-full pl-4 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "1.5em 1.5em",
          backgroundRepeat: "no-repeat",
        }}
      >
        {isPlaceholder && (
          <option value="" disabled>
            {defaultValue}
          </option>
        )}
        {!isPlaceholder && <option value={defaultValue}>{defaultValue}</option>}
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ad Formats Demo Form</h1>
        <p className="text-sm text-slate-400 mt-1">
          Choose required options to generate an ad format demo link.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SelectInput
              label="Ad View"
              options={AD_VIEW_OPTIONS}
              defaultValue="Please select an option ..."
              isPlaceholder
            />
            <SelectInput
              label="Template"
              options={TEMPLATE_OPTIONS}
              defaultValue="None"
            />
            <SelectInput
              label="Ad Format"
              options={AD_FORMAT_OPTIONS}
              defaultValue="None"
            />
            <SelectInput
              label="Logo"
              options={LOGO_OPTIONS}
              defaultValue="None"
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Source
              </label>
              <div className="flex items-center space-x-2">
                <select
                  className="pl-4 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1.5em 1.5em",
                    backgroundRepeat: "no-repeat",
                  }}
                  defaultValue="Demo"
                >
                  <option>Demo</option>
                  <option>Stage</option>
                  <option>Prod</option>
                </select>
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon name="link" className="w-5 h-5 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="source here ..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <button
                  type="button"
                  className="flex items-center space-x-2 border border-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md text-sm hover:bg-slate-700"
                >
                  <Icon name="externalLink" className="w-4 h-4" />
                  <span>OUTPUT SOURCE</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
                  >
                    <Icon name="copy" className="w-4 h-4" />
                    <span>COPY</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-md text-sm"
                  >
                    <Icon name="externalLink" className="w-4 h-4" />
                    <span>OPEN IN NEW TAB</span>
                  </button>
                </div>
              </div>
              <textarea
                rows={4}
                disabled
                className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-md text-sm text-slate-400 resize-none cursor-not-allowed"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                >
                  <Icon name="paperPlane" className="w-5 h-5" />
                  <span>SUBMIT</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                >
                  <Icon name="reset" className="w-5 h-5" />
                  <span>RESET</span>
                </button>
              </div>
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                CONVERSION
              </button>
            </div>
          </form>
        </div>
        <div className="lg:w-1/3">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Template Preview
          </label>
          <div className="w-full h-64 bg-slate-700 rounded-md flex flex-col items-center justify-center text-slate-500">
            <Icon name="image" className="w-16 h-16 mb-4" />
            <p className="font-semibold">No Preview Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildDemo;
