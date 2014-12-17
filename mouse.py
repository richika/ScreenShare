from pymouse import PyMouse
m = PyMouse()
while True:
	x = raw_input()
	x = x.split()
	print x[0], x[1]
	m.click(int(x[0]), int(x[1]), 1)