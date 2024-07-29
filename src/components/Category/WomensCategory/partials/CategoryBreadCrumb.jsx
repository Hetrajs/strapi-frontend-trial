import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparatorCategory,
  } from "@/components/ui/breadcrumb"
  import { Link, useParams } from "react-router-dom"
  
  export function BreadcrumbWithCustomSeparator() {
    const { slug } = useParams();
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="Fira text-[16px] font-normal text-white hover:text-[#cecece] leading-[29px]">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparatorCategory />
          <BreadcrumbItem>
            <BreadcrumbPage className="Fira text-[16px] font-medium capitalize text-white leading-[29px]">Women's Wear</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }