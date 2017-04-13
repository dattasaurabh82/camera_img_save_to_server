import Tkinter
from Tkinter import *
import socket

root = Tk()

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
myIP = s.getsockname()[0]
print (myIP)
           
root.geometry("800x600")
root.attributes('-fullscreen', True)
root.configure(background='black', cursor='none')

header = Label(root, text='USE THESE IN WEB APP', bg='black', fg='white', font=('Courier', 38))
header.place(x=20, y=20)

ip_lbl = Label(root, text="IP: " + str(myIP), bg='black', fg='white', font=('Courier', 40))
ip_lbl.place(x=20, y=140)

port_lbl = Label(root, text='PORT: 8081', bg='black', fg='white', font=('Courier', 40))
port_lbl.place(x=20, y=210)

s.close()
root.mainloop()
