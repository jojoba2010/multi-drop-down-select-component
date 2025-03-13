# Feature : 

## 1. Placeholder
You can change the placeholder by passing it as a string. By default, it has the value "Select one item.

![image](https://github.com/user-attachments/assets/342b33b4-cf98-4397-8a47-410b77c79688)

## 2. DefaultValue
It is optional and used to pre-select the items in the dropdown by default. It accepts the Item[] type.

![image](https://github.com/user-attachments/assets/c6bd8e43-32fb-4c29-91df-539d77ded808)

## 3. OnChange
It is optional, will fire when any selection changes in the dropdown list, and will pass the selected items with the Item[] type. 

## 4. OnNewItemAdded
It is optional, will fire when any new item is added to the dropdown list, and will pass a new item with Item type as the first argument and the second argument will be all items with the Item[] type. 

## 5. Width
It will set the width of the dropdown main container, it is optional and the default value is 500px.
![image](https://github.com/user-attachments/assets/ecba0fe1-ba40-4b5d-b6eb-efa3b834cbe8)

## 6. MaxWidthSelectedItem
It will set the max width of the selected item width in the dropdown main container, it is optional and the default value is 300px.
  ### note: If selected items reach the maxWidthSelectedItem then it will show the number of items that are selected but not have the width to show them. check the image for a better understanding.
  
![image](https://github.com/user-attachments/assets/d85c1466-3220-4f0b-91d2-a13b3926f565)

## 7.Items
It's the list of all items in the list with the Item[] type.

## 8. Remove all selected items at once
By clicking on this icon you can remove all selected items at once.

![image](https://github.com/user-attachments/assets/c8f047e6-aa00-43a8-9691-e197913ba07b)

## 9. Add a new item to the list
By pressing enter two scenarios will happen first if the item doesn't exist then will be added to the list and by default will be selected as well, the second scenario is if it exists then it will selected.

![image](https://github.com/user-attachments/assets/1c8d3f44-cee3-4724-bfa8-22047e622c2a)

## 10.Remove a single item for selection
You can do it by clicking the close icon side of any selected item or click on the selected item in the list then it will remove the item from the selection list.

![image](https://github.com/user-attachments/assets/425c8300-5ade-49a6-8f3f-b966afab5ea0)

## 11. Item with big size
If any item in the list has big text then it will show like the one below with 3 dots.

![image](https://github.com/user-attachments/assets/08dddc14-004e-4242-a2d7-79a5b1928361)
