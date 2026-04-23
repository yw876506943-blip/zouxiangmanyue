import React from 'react';
import { iconsBase64 } from './icons-base64';

export const createIcon = (name: string) => {
  return ({ size = 24, className = '', color, style, ...props }: any) => {
    return (
      <span 
        className={className}
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          backgroundColor: color || 'currentColor',
          WebkitMaskImage: `url(${(iconsBase64 as any)[name]})`,
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(${(iconsBase64 as any)[name]})`,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          display: 'inline-block',
          ...style
        }}
        {...props}
      />
    );
  };
};

export const Camera = createIcon('Camera');
export const Home = createIcon('Home');
export const Briefcase = createIcon('Briefcase');
export const User = createIcon('User');
export const X = createIcon('X');
export const Link = createIcon('Link');
export const QrCode = createIcon('QrCode');
export const MessageCircle = createIcon('MessageCircle');
export const Check = createIcon('Check');
export const Download = createIcon('Download');
export const Search = createIcon('Search');
export const ChevronLeft = createIcon('ChevronLeft');
export const MoreHorizontal = createIcon('MoreHorizontal');
export const Plus = createIcon('Plus');
export const Heart = createIcon('Heart');
export const Phone = createIcon('Phone');
export const Share = createIcon('Share');
export const MapPin = createIcon('MapPin');
export const Star = createIcon('Star');
export const ChevronRight = createIcon('ChevronRight');
export const Settings = createIcon('Settings');
export const Trash2 = createIcon('Trash2');
export const GripVertical = createIcon('GripVertical');
export const Layers = createIcon('Layers');
export const FolderHeart = createIcon('FolderHeart');
export const ImagePlus = createIcon('ImagePlus');
export const Share2 = createIcon('Share2');
export const MessageSquare = createIcon('MessageSquare');
export const Sparkles = createIcon('Sparkles');
export const DollarSign = createIcon('DollarSign');
export const Info = createIcon('Info');
export const Edit3 = createIcon('Edit3');
export const LayoutTemplate = createIcon('LayoutTemplate');
export const Clock = createIcon('Clock');
export const Lock = createIcon('Lock');
export const Headphones = createIcon('Headphones');
export const Bell = createIcon('Bell');
export const Calendar = createIcon('Calendar');
export const ChevronDown = createIcon('ChevronDown');
export const CheckCircle2 = createIcon('CheckCircle2');
export const Circle = createIcon('Circle');
export const XCircle = createIcon('XCircle');
export const List = createIcon('List');
export const Image = createIcon('Image');
export const PieChart = createIcon('PieChart');
export const MoreVertical = createIcon('MoreVertical');
export const Eye = createIcon('Eye');
export const EyeOff = createIcon('EyeOff');
export const Link2 = createIcon('Link2');
export const UploadCloud = createIcon('UploadCloud');
export const Play = createIcon('Play');
export const TrendingUp = createIcon('TrendingUp');
export const Wallet = createIcon('Wallet');
export const ArrowUpRight = createIcon('ArrowUpRight');
export const ArrowDownRight = createIcon('ArrowDownRight');
export const AlertCircle = createIcon('AlertCircle');
export const Tag = createIcon('Tag');
export const Filter = createIcon('Filter');
export const CalendarDays = createIcon('CalendarDays');
export const Video = createIcon('Video');
export const Edit = createIcon('Edit');
export const Unlock = createIcon('Unlock');
export const ImageIcon = createIcon('ImageIcon');
