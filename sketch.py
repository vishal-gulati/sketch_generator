import cv2 
import sys
import os

def sketch_image(photo):
    image=cv2.imread(photo)
    grey_image=cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    invert_image=cv2.bitwise_not(grey_image)
    blur_image=cv2.GaussianBlur(invert_image, (85,85),0)
    invert_blur_image=cv2.bitwise_not(blur_image)
    sketch_image=cv2.divide(grey_image,invert_blur_image, scale=256.0)
    cv2.imwrite('public/image.jpg', sketch_image)

oldname = sys.argv[1]
newname = oldname+'.jpg'
os.rename(oldname,newname)
sketch_image(newname)
os.remove(newname)