<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PropertyPhotoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'file_name' => $this->file_name,
            'file_path' => $this->file_path,
            'file_url' => $this->getFileUrl(),
            'file_size' => $this->file_size,
            'file_size_human' => $this->getFileSizeHuman(),
            'mime_type' => $this->mime_type,
            'width' => $this->width,
            'height' => $this->height,
            'display_order' => $this->display_order,
            'is_main' => (bool) $this->is_main,
            'caption' => $this->caption,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get the public URL for the file
     */
    private function getFileUrl(): string
    {
        if (!$this->file_path) {
            return '';
        }

        return Storage::disk('public')->url($this->file_path);
    }

    /**
     * Get human-readable file size
     */
    private function getFileSizeHuman(): string
    {
        if (!$this->file_size) {
            return '0 B';
        }

        $size = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $unitIndex = 0;

        while ($size >= 1024 && $unitIndex < count($units) - 1) {
            $size /= 1024;
            $unitIndex++;
        }

        return round($size, 2) . ' ' . $units[$unitIndex];
    }
}
