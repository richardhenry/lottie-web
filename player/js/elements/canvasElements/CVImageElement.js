import {
  extendPrototype,
} from '../../utils/functionExtensions';
import RenderableElement from '../helpers/RenderableElement';
import BaseElement from '../BaseElement';
import TransformElement from '../helpers/TransformElement';
import HierarchyElement from '../helpers/HierarchyElement';
import FrameElement from '../helpers/FrameElement';
import CVBaseElement from './CVBaseElement';
import IImageElement from '../ImageElement';
import SVGShapeElement from '../svgElements/SVGShapeElement';

function CVImageElement(data, globalData, comp) {
  this.assetData = globalData.getAssetData(data.refId);
  this.img = globalData.imageLoader.getAsset(this.assetData);
  this.initElement(data, globalData, comp);
}
extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement);

CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement;
CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame;

CVImageElement.prototype.renderInnerContent = function () {
  var imgW = this.img.width;
  var imgH = this.img.height;

  var imgRel = imgW / imgH;
  var canvasRel = this.assetData.w / this.assetData.h;
  var widthCrop;
  var heightCrop;
  var par = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;

  if ((imgRel > canvasRel && par === 'xMidYMid slice') || (imgRel < canvasRel && par !== 'xMidYMid slice')) {
    heightCrop = imgH;
    widthCrop = heightCrop * canvasRel;
  } else {
    widthCrop = imgW;
    heightCrop = widthCrop / canvasRel;
  }

  this.canvasContext.drawImage(this.img, (imgW - widthCrop) / 2, (imgH - heightCrop) / 2, widthCrop, heightCrop, 0, 0, this.assetData.w, this.assetData.h);
};

CVImageElement.prototype.destroy = function () {
  this.img = null;
};

export default CVImageElement;
