// // import React, { useState } from "react";
// // import axios from "axios";
// // import { Button } from "../ui/button";

// // const MealForm = () => {
// //   const [mealImage, setMealImage] = useState<File | null>(null);
// //   const [mealText, setMealText] = useState<string>("");
// //   const [result, setResult] = useState<any>(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setMealImage(e.target.files[0]);
// //       setMealText(""); // Clear text if image is uploaded
// //     }
// //   };

// //   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
// //     setMealText(e.target.value);
// //     setMealImage(null); // Clear image if text is entered
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setResult(null);

// //     try {
// //       const formData = new FormData();
      
// //       if (mealImage) {
// //         formData.append('file', mealImage);
// //       } else if (mealText) {
// //         formData.append('text', mealText);
// //       } else {
// //         throw new Error('Please provide an image or text description');
// //       }

// //       const response = await axios.post('http://localhost:8000/analyze-meal', formData, {
// //         headers: {
// //           'Content-Type': mealImage ? 'multipart/form-data' : 'application/json',
// //         },
// //       });

// //       if (response.data.error) {
// //         throw new Error(response.data.error);
// //       }

// //       setResult(response.data.nutrition);
// //     } catch (error) {
// //       console.error("Error:", error);
// //       setResult(error instanceof Error ? error.message : 'An error occurred');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
// //       <h2 className="text-2xl font-bold text-center">AI Meal Analyzer 🍱</h2>

// //       <form onSubmit={handleSubmit} className="space-y-4 p-4">
// //         <div>
// //           <label className="block font-medium">Upload Meal Image</label>
// //           <input type="file" accept="image/*" onChange={handleImageChange} />
// //         </div>

// //         <div>
// //           <label className="block font-medium">Or Enter Meal Description</label>
// //           <textarea
// //             value={mealText}
// //             onChange={handleTextChange}
// //             rows={4}
// //             className="w-full p-2 border rounded"
// //             placeholder="e.g. 2 boiled eggs and 1 glass of milk"
// //           />
// //         </div>

// //         <Button 
// //           type="submit"
// //           disabled={loading}
// //           className="w-full bg-primary hover:bg-primary-dark"
// //         >
// //           {loading ? "Analyzing..." : "Log Meal"}
// //         </Button>
// //       </form>

// //       {result && (
// //         <div className="mt-6 p-4 bg-gray-100 rounded">
// //           <h3 className="font-semibold text-lg mb-2">Nutrition Breakdown</h3>
// //           <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MealForm;
// import React, { useState } from "react";
// import axios from "axios";
// import { Button } from "../ui/button";
// import { motion } from "framer-motion";

// interface NutritionInfo {
//   calories: number;
//   protein: number;
//   fat: number;
//   carbs: number;
//   fiber?: number;
//   sugar?: number;
//   food_items?: string[];
//   [key: string]: any;
// }

// const MealForm = () => {
//   const [mealImage, setMealImage] = useState<File | null>(null);
//   const [mealText, setMealText] = useState<string>("");
//   const [result, setResult] = useState<NutritionInfo | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setMealImage(file);
//       setMealText(""); // Clear text if image is uploaded
      
//       // Create preview URL
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setMealText(e.target.value);
//     setMealImage(null); // Clear image if text is entered
//     setImagePreview(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setResult(null);
//     setError(null);

//     try {
//       let response;
      
//       if (mealImage) {
//         const formData = new FormData();
//         formData.append('image', mealImage);
        
//         response = await axios.post('https://fitnessbot-9aq2.onrender.com/nutrition-analyzer', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       } else if (mealText) {
//         // Based on your Python example, sending the description directly
//         response = await axios.post('https://fitnessbot-9aq2.onrender.com/nutrition-analyzer', {
//           description: mealText
//         }, {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//       } else {
//         throw new Error('Please provide an image or text description');
//       }

//       if (response.data.error) {
//         throw new Error(response.data.error);
//       }

//       setResult(response.data);
//     } catch (error: any) {
//       console.error("Error:", error);
//       if (error.response) {
//         console.error("Response data:", error.response.data);
//         console.error("Response status:", error.response.status);
//         setError(`API Error (${error.response.status}): ${
//           error.response.data.detail || JSON.stringify(error.response.data) || 'Unknown error'
//         }`);
//       } else {
//         setError(error instanceof Error ? error.message : 'An error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setMealImage(null);
//     setMealText("");
//     setImagePreview(null);
//     setResult(null);
//     setError(null);
//   };
// console.log("Result:", result);
//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
//       <motion.h2 
//         className="text-2xl font-bold text-center"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         AI Meal Analyzer 🍱
//       </motion.h2>

//       {!result ? (
//         <motion.form 
//           onSubmit={handleSubmit} 
//           className="space-y-4 p-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//         >
//           <div className="space-y-2">
//             <label className="block font-medium">Upload Meal Image</label>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 onChange={handleImageChange} 
//                 className="hidden" 
//                 id="meal-image" 
//               />
//               <label htmlFor="meal-image" className="cursor-pointer flex flex-col items-center">
//                 {imagePreview ? (
//                   <img 
//                     src={imagePreview} 
//                     alt="Meal preview" 
//                     className="h-40 object-contain mb-2" 
//                   />
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 )}
//                 {imagePreview ? "Change Image" : "Click to upload image"}
//               </label>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="block font-medium">Or Enter Meal Description</label>
//             <textarea
//               value={mealText}
//               onChange={handleTextChange}
//               rows={4}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
//               placeholder="e.g. 1 bowl rajma chawal with salad and buttermilk"
//               disabled={!!imagePreview}
//             />
//           </div>

//           {error && (
//             <motion.div 
//               className="p-3 bg-red-50 text-red-700 rounded-md text-sm"
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               transition={{ duration: 0.3 }}
//             >
//               {error}
//             </motion.div>
//           )}

//           <Button 
//             type="submit"
//             disabled={loading || (!mealImage && !mealText)}
//             className="w-full bg-primary hover:bg-primary-dark text-white transition-colors py-2"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Analyzing Meal...
//               </span>
//             ) : (
//               "Log Meal"
//             )}
//           </Button>
//         </motion.form>
//       ) : (
//         <motion.div
//           className="space-y-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.div 
//             className="bg-green-50 p-4 rounded-lg text-center text-green-700"
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <p className="font-medium">Nutrition analysis complete!</p>
//           </motion.div>
          
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//             {[
//               { label: "Calories", value: result.calories, unit: "kcal", icon: "🔥" },
//               { label: "Protein", value: result.protein, unit: "g", icon: "🥩" },
//               { label: "Carbs", value: result.carbs, unit: "g", icon: "🍚" },
//               { label: "Fat", value: result.fat, unit: "g", icon: "🧈" },
//             ].map((item, index) => (
//               <motion.div 
//                 key={item.label}
//                 className="bg-white shadow rounded-lg p-4 text-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1, duration: 0.3 }}
//               >
//                 <div className="text-2xl mb-1">{item.icon}</div>
//                 <p className="text-xs text-gray-500">{item.label}</p>
//                 <p className="text-xl font-bold">
//                   {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
//                   <span className="text-xs font-normal ml-1">{item.unit}</span>
//                 </p>
//               </motion.div>
//             ))}
//           </div>

//           {result.food_items && result.food_items.length > 0 && (
//             <motion.div 
//               className="bg-white shadow rounded-lg p-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4, duration: 0.3 }}
//             >
//               <h3 className="font-medium mb-2">Detected Foods</h3>
//               <ul className="list-disc list-inside">
//                 {result.food_items.map((item, index) => (
//                   <motion.li 
//                     key={index}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
//                     className="text-gray-700"
//                   >
//                     {item}
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}

//           {/* Additional nutritional details if available */}
//           {(result.fiber !== undefined || result.sugar !== undefined) && (
//             <motion.div 
//               className="bg-white shadow rounded-lg p-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6, duration: 0.3 }}
//             >
//               <h3 className="font-medium mb-2">Additional Details</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {result.fiber !== undefined && (
//                   <div className="bg-gray-50 p-2 rounded">
//                     <p className="text-xs text-gray-500">Fiber</p>
//                     <p className="font-medium">{result.fiber.toFixed(1)}g</p>
//                   </div>
//                 )}
//                 {result.sugar !== undefined && (
//                   <div className="bg-gray-50 p-2 rounded">
//                     <p className="text-xs text-gray-500">Sugar</p>
//                     <p className="font-medium">{result.sugar.toFixed(1)}g</p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}
          
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7, duration: 0.3 }}
//           >
//             <Button 
//               onClick={resetForm} 
//               className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
//             >
//               Log Another Meal
//             </Button>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default MealForm;
import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  sugar?: number;
  food_items?: string[];
  estimated_food_items?: string[];
  carbohydrates?: number;
  [key: string]: any;
}

const MealForm = () => {
  const [mealImage, setMealImage] = useState<File | null>(null);
  const [mealText, setMealText] = useState<string>("");
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMealImage(file);
      setMealText(""); // Clear text if image is uploaded
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMealText(e.target.value);
    setMealImage(null); // Clear image if text is entered
    setImagePreview(null);
  };

  const parseResponseData = (data: any): NutritionInfo => {
    // For debugging
    setRawResponse(data);
    
    // If data is already in the correct format
    if (typeof data === 'object' && data !== null && 'calories' in data) {
      return data;
    }
    const extractNumber = (str: string | number | undefined): number => {
      if (typeof str === "number") return str;
      if (typeof str === "string") {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0]) : NaN;
      }
      return NaN;
    };
    // If data comes as a response object with a string
    if (data && typeof data.response === 'string') {
      try {
        // Try to extract JSON from markdown code block if present
        const jsonMatch = data.response.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const parsedData = JSON.parse(jsonMatch[1]);
          return {
            calories: extractNumber(parsedData.calories),
            protein: extractNumber(parsedData.protein),
            carbs: extractNumber(parsedData.carbohydrates),
            fat: extractNumber(parsedData.fat),
            fiber: parsedData.fiber !== undefined ? extractNumber(parsedData.fiber) : undefined,
            sugar: parsedData.sugar !== undefined ? extractNumber(parsedData.sugar) : undefined,
            food_items: parsedData.estimated_food_items || []
          };
        }
        
        // If no code block, try parsing the entire response
        return JSON.parse(data.response);
      }
      
      catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid response format");
      }
    }
    
    throw new Error("Unexpected response format");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setRawResponse(null);

    try {
      let response;
      
      if (mealImage) {
        const formData = new FormData();
        formData.append('image', mealImage);
        
        response = await axios.post('https://fitnessbot-9aq2.onrender.com/nutrition-analyzer', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (mealText) {
        response = await axios.post('https://fitnessbot-9aq2.onrender.com/nutrition-analyzer', {
          description: mealText
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        throw new Error('Please provide an image or text description');
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const parsedData = parseResponseData(response.data);
      setResult(parsedData);
      
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setError(`API Error (${error.response.status}): ${
          error.response.data.detail || JSON.stringify(error.response.data) || 'Unknown error'
        }`);
      } else {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMealImage(null);
    setMealText("");
    setImagePreview(null);
    setResult(null);
    setError(null);
    setRawResponse(null);
  };
  
  console.log("Raw response:", rawResponse);
  console.log("Parsed result:", result);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
      <motion.h2 
        className="text-2xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI Meal Analyzer 🍱
      </motion.h2>

      {/* Debug section - remove in production */}
      {rawResponse && !result && (
        <div className="bg-yellow-50 p-4 rounded text-sm">
          <p className="font-bold">Debug - Raw Response:</p>
          <pre className="overflow-auto max-h-40">{JSON.stringify(rawResponse, null, 2)}</pre>
        </div>
      )}

      {!result ? (
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="space-y-2">
            <label className="block font-medium">Upload Meal Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
                id="meal-image" 
              />
              <label htmlFor="meal-image" className="cursor-pointer flex flex-col items-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Meal preview" 
                    className="h-40 object-contain mb-2" 
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {imagePreview ? "Change Image" : "Click to upload image"}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Or Enter Meal Description</label>
            <textarea
              value={mealText}
              onChange={handleTextChange}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g. 1 bowl rajma chawal with salad and buttermilk"
              disabled={!!imagePreview}
            />
          </div>

          {error && (
            <motion.div 
              className="p-3 bg-red-50 text-red-700 rounded-md text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <Button 
            type="submit"
            disabled={loading || (!mealImage && !mealText)}
            className="w-full bg-primary hover:bg-primary-dark text-white transition-colors py-2"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Meal...
              </span>
            ) : (
              "Log Meal"
            )}
          </Button>
        </motion.form>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="bg-green-50 p-4 rounded-lg text-center text-green-700"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium">Nutrition analysis complete!</p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Calories", value: result.calories, unit: "kcal", icon: "🔥" },
              { label: "Protein", value: result.protein, unit: "g", icon: "🥩" },
              { label: "Carbs", value: result.carbs, unit: "g", icon: "🍚" },
              { label: "Fat", value: result.fat, unit: "g", icon: "🧈" },
            ].map((item, index) => (
              <motion.div 
                key={item.label}
                className="bg-white shadow rounded-lg p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-bold">
                  {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
                  <span className="text-xs font-normal ml-1">{item.unit}</span>
                </p>
              </motion.div>
            ))}
          </div>

          {result.food_items && result.food_items.length > 0 && (
            <motion.div 
              className="bg-white shadow rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <h3 className="font-medium mb-2">Detected Foods</h3>
              <ul className="list-disc list-inside">
                {result.food_items.map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    className="text-gray-700"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Additional nutritional details if available */}
          {(result.fiber !== undefined || result.sugar !== undefined) && (
            <motion.div 
              className="bg-white shadow rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <h3 className="font-medium mb-2">Additional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {result.fiber !== undefined && (
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Fiber</p>
                    <p className="font-medium">{result.fiber.toFixed(1)}g</p>
                  </div>
                )}
                {result.sugar !== undefined && (
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Sugar</p>
                    <p className="font-medium">{result.sugar.toFixed(1)}g</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <Button 
              onClick={resetForm} 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Log Another Meal
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MealForm;