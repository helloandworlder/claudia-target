/**
 * 缩放管理器 - 支持应用界面缩放比率设置
 */

export type ZoomLevel = number; // 50 到 300，步长 10

export interface ZoomPreset {
  label: string;
  value: ZoomLevel;
  description: string;
}

export const zoomPresets: ZoomPreset[] = [
  { label: '50%', value: 50, description: 'Smallest' },
  { label: '75%', value: 75, description: 'Smaller' },
  { label: '100%', value: 100, description: 'Default' },
  { label: '125%', value: 125, description: 'Larger' },
  { label: '150%', value: 150, description: 'Large' },
  { label: '200%', value: 200, description: 'Extra Large' },
  { label: '300%', value: 300, description: 'Maximum' },
];

export class ZoomManager {
  private static instance: ZoomManager;
  private currentZoom: ZoomLevel = 100;
  private readonly MIN_ZOOM = 50;
  private readonly MAX_ZOOM = 300;
  private readonly ZOOM_STEP = 10;

  private constructor() {
    this.loadZoomFromStorage();
    this.applyZoom(this.currentZoom);
  }

  static getInstance(): ZoomManager {
    if (!ZoomManager.instance) {
      ZoomManager.instance = new ZoomManager();
    }
    return ZoomManager.instance;
  }

  getCurrentZoom(): ZoomLevel {
    return this.currentZoom;
  }

  setZoom(zoom: ZoomLevel): void {
    // 确保缩放值在有效范围内且为10的倍数
    const validZoom = Math.max(
      this.MIN_ZOOM,
      Math.min(this.MAX_ZOOM, Math.round(zoom / this.ZOOM_STEP) * this.ZOOM_STEP)
    );
    
    this.currentZoom = validZoom;
    this.applyZoom(validZoom);
    this.saveZoomToStorage();
  }

  increaseZoom(): void {
    const newZoom = Math.min(this.MAX_ZOOM, this.currentZoom + this.ZOOM_STEP);
    this.setZoom(newZoom);
  }

  decreaseZoom(): void {
    const newZoom = Math.max(this.MIN_ZOOM, this.currentZoom - this.ZOOM_STEP);
    this.setZoom(newZoom);
  }

  resetZoom(): void {
    this.setZoom(100);
  }

  getZoomRange(): { min: number; max: number; step: number } {
    return {
      min: this.MIN_ZOOM,
      max: this.MAX_ZOOM,
      step: this.ZOOM_STEP,
    };
  }

  getZoomPresets(): ZoomPreset[] {
    return zoomPresets;
  }

  private applyZoom(zoom: ZoomLevel): void {
    const zoomFactor = zoom / 100;
    
    // 应用到 body 元素
    document.body.style.zoom = zoomFactor.toString();
    
    // 设置CSS变量供其他组件使用
    document.documentElement.style.setProperty('--app-zoom', zoomFactor.toString());
    document.documentElement.style.setProperty('--app-zoom-percent', `${zoom}%`);

    // 触发缩放变更事件
    window.dispatchEvent(new CustomEvent('zoomChanged', { 
      detail: { zoom, zoomFactor } 
    }));
  }

  private saveZoomToStorage(): void {
    try {
      localStorage.setItem('claudia-zoom', this.currentZoom.toString());
    } catch (error) {
      console.warn('Failed to save zoom settings to localStorage:', error);
    }
  }

  private loadZoomFromStorage(): void {
    try {
      const savedZoom = localStorage.getItem('claudia-zoom');
      if (savedZoom) {
        const zoom = parseInt(savedZoom, 10);
        if (!isNaN(zoom) && zoom >= this.MIN_ZOOM && zoom <= this.MAX_ZOOM) {
          this.currentZoom = zoom;
        }
      }
    } catch (error) {
      console.warn('Failed to load zoom settings from localStorage:', error);
    }
  }
}

// 导出单例实例
export const zoomManager = ZoomManager.getInstance(); 