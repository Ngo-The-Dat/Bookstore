import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterSidebar = ({ 
  authors, 
  publishers, 
  filters, 
  onFilterChange, 
  onApply 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Bộ lọc tìm kiếm</h3>

      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Khoảng giá (VNĐ)</Label>
        <div className="flex gap-2 items-center">
          <Input 
            type="number" 
            placeholder="Từ" 
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
            className="h-8 text-sm"
          />
          <span>-</span>
          <Input 
            type="number" 
            placeholder="Đến" 
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Tác giả</Label>
        <Select 
          value={filters.TACGIA} 
          onValueChange={(val) => onFilterChange("TACGIA", val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tác giả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {authors.map((item, idx) => (
              <SelectItem key={idx} value={item.NXB || item._id}> 
                {item.NXB || item._id} ({item.total_books})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Nhà xuất bản</Label>
        <Select 
          value={filters.NXB} 
          onValueChange={(val) => onFilterChange("NXB", val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn NXB" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {publishers.map((item, idx) => (
              <SelectItem key={idx} value={item.NXB || item._id}>
                {item.NXB || item._id} ({item.total_books})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sắp xếp */}
      <div className="space-y-3">
        <Label className="text-gray-700 font-medium">Sắp xếp theo giá</Label>
        <Select 
          value={filters.order} 
          onValueChange={(val) => {
            onFilterChange("sort", "GIABAN");
            onFilterChange("order", val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Giá tăng dần</SelectItem>
            <SelectItem value="desc">Giá giảm dần</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onApply} className="w-full mt-4">
        Áp dụng bộ lọc
      </Button>
    </div>
  );
};

export default FilterSidebar;