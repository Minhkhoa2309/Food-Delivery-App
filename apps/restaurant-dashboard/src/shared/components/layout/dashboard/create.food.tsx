"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { foodCategoryItems } from "@/apps/restaurant-dashboard/src/app/configs/constants";
import { ChangeEvent, DragEvent, useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  estimatedPrice: z.number(),
  category: z.string(),
  images: z.array(z.string())
})

type createFoodSchema = z.infer<typeof formSchema>;

const CreateFood = () => {

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<createFoodSchema>({
    resolver: zodResolver(formSchema)
  });

  const [dragging, setDragging] = useState(false);

  const onSubmit = async (data: createFoodSchema) => {
    console.log(data);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  // For selecting Image
  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      const imageArray = files.map((file) => {
        const reader = new FileReader();
        return new Promise<string>((resolve) => {
          reader.onload = () => {
            if (reader.readyState === 2) {
              resolve(reader.result as string)
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imageArray).then((imageUrls) => {
        setValue("images", imageUrls);
      });
    };
  };

  // For drop Image 
  const handleImageDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);

      const imageArray = files.map((file) => {
        const reader = new FileReader();
        return new Promise<string>((resolve) => {
          reader.onload = () => {
            if (reader.readyState === 2) {
              resolve(reader.result as string)
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imageArray).then((imageUrls) => {
        setValue("images", imageUrls);
      });
    };
  };

  return (
    <div className="w-full pb-10">
      <div className="md:w-[70%] w-full m-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <div>
            <label className="label">Enter Food Name</label>
            <input {...register('name')} type="text" className="input" placeholder="Spicy Chicken Wings" />
            {
              errors.name && (
                <span className="text-red-500 block mt-1">
                  {errors.name.message}
                </span>
              )
            }
          </div>
          <div>
            <label className="label mt-2">Enter Food Description</label>
            <textarea {...register('description')} rows={8} cols={25} className="input !h-[unset] !p-2" placeholder="Fry chicken wings with spicy sauce" />
            {
              errors.description && (
                <span className="text-red-500 block mt-1">
                  {errors.description.message}
                </span>
              )
            }
          </div>
          <div className="flex items-center flex-wrap justify-between mt-2">
            <div className="w-[48%]">
              <label className="label">Enter Food Price</label>
              <input {...register('price', { valueAsNumber: true })} type="number" className="input" placeholder="15" />
              {
                errors.price && (
                  <span className="text-red-500 block mt-1">
                    {errors.price.message}
                  </span>
                )
              }
            </div>
            <div className="w-[48%]">
              <label className="label">Enter Food Estimated Price</label>
              <input {...register('estimatedPrice', { valueAsNumber: true })} type="number" className="input" placeholder="15" />
              {
                errors.estimatedPrice && (
                  <span className="text-red-500 block mt-1">
                    {errors.estimatedPrice.message}
                  </span>
                )
              }
            </div>
          </div>
          <div>
            <label className="label mt-2">Enter Food Category</label>
            <select
              {...register('category')}
              className="input"
              onChange={(e) => {
                setValue('category', e.target.value)
              }}
            >
              {foodCategoryItems.map((item, index) => (
                <option className="bg-black" key={index} value={item.title}>{item.title}</option>
              ))}
            </select>
            {
              errors.category && (
                <span className="text-red-500 block mt-1">
                  {errors.category.message}
                </span>
              )
            }
          </div>
          <label className="label mt-3">Upload Food Images</label>
          <div className="w-full">
            <input type="file" required accept="image/*" multiple id="file" className="hidden" onChange={handleImageFileChange} />
            <label 
            htmlFor="file" 
            className={`w-full mt-2 rounded-md min-h-[15vh] border-white p-3 border flex items-center ${dragging ? 'bg-blue-500' : 'bg-transparent'}`}
            onDragOver={handleDragOver}
            onDrop={handleImageDrop}
            onDragLeave={handleDragLeave}
            >
              {
                watch('images') ? (
                  <>
                    {watch('images')?.map(image => (
                      <Image
                        src={image}
                        width={300}
                        height={300}
                        alt="image"
                        key={image}
                        className="w-full md:w-[48%] object-cover md:m-2 my-2"
                      />
                    ))}
                  </>
                ) : (
                  <span className="text-white">
                    Drap and drop your food images here or click to browse
                  </span>
                )
              }
            </label>
          </div>
          <input type="submit" value={'Create'} disabled={isSubmitting} className="button !w-[200px] mt-5 !p-0 !text-2xl" />
        </form>
      </div>
    </div>
  )
}

export default CreateFood