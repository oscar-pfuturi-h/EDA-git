class Point {
	constructor(x, y, z, userData) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.geometry = new THREE.SphereGeometry(2, 10, 10);
		this.material = new THREE.MeshBasicMaterial();
		this.sphere = new THREE.Mesh(this.geometry, this.material);
		this.sphere.position.set(this.x, this.y, this.z);
		scene.add(this.sphere);
	}
}

class Box {
	constructor(x, y, z, w, h, d) {
		this.x = x; // center
		this.y = y;
		this.z = z;
		this.w = w; // half width
		this.h = h; // half height
		this.d = d; // half depth
	}

	contains(point) {
		if (point.x <= this.x + this.w && point.y <= this.y + this.h && point.z <= this.z + this.d &&
			point.x >= this.x - this.w && point.y >= this.y - this.h && point.z >= this.z - this.d) {
			return 1;
		}
		return 0;
	}

	intersects(range) {
		return !(range.x - range.w > this.x + this.w || range.x + range.w < this.x - this.w ||
				range.y - range.h > this.y + this.h || range.y + range.h < this.y - this.h ||
				range.z - range.d > this.z + this.d || range.z + range.d < this.z - this.d);
	}
}

class OcTree {
	constructor(boundary, n) {
		this.boundary = boundary; // object Box;
		this.capacity = n; 
		this.points = []; // points array 
		this.divided = false;

		this.color = new THREE.Color(Math.random()*1, Math.random()*1, Math.random()*1);

		this.geometry = new THREE.BoxGeometry(boundary.w*2, boundary.h*2, boundary.d*2);
		this.material = new THREE.MeshBasicMaterial({color: 0x00ff00, opacity: 0.2, transparent: true});
		this.material.color.set(this.color);
		this.box = new THREE.Mesh(this.geometry, this.material);
		this.box.position.set(boundary.x, boundary.y, boundary.z);
		scene.add(this.box);
	}

	subdivide() {
		let x = this.boundary.x;
		let y = this.boundary.y;
		let z = this.boundary.z;
		let w = this.boundary.w/2;
		let h = this.boundary.h/2;
		let d = this.boundary.d/2;

		let b_topRightFront    = new Box(x + w, y + h, z + d, w, h, d);
		let b_topLeftFront     = new Box(x - w, y + h, z + d, w, h, d);
		let b_bottomRightFront = new Box(x + w, y - h, z + d, w, h, d);
		let b_bottomLeftFront  = new Box(x - w, y - h, z + d, w, h, d);
		let b_topRightBack     = new Box(x + w, y + h, z - d, w, h, d);
		let b_topLeftBack      = new Box(x - w, y + h, z - d, w, h, d);
		let b_bottomRightBack  = new Box(x + w, y - h, z - d, w, h, d);
		let b_bottomLeftBack   = new Box(x - w, y - h, z - d, w, h, d);

		this.topRightFront    = new OcTree(b_topRightFront, this.capacity);
		this.topLeftFront     = new OcTree(b_topLeftFront, this.capacity);
		this.bottomRightFront = new OcTree(b_bottomRightFront, this.capacity);
		this.bottomLeftFront  = new OcTree(b_bottomLeftFront, this.capacity);
		this.topRightBack     = new OcTree(b_topRightBack, this.capacity);
		this.topLeftBack      = new OcTree(b_topLeftBack, this.capacity);
		this.bottomRightBack  = new OcTree(b_bottomRightBack, this.capacity);
		this.bottomLeftBack   = new OcTree(b_bottomLeftBack, this.capacity);

		this.divided = true;
	}

	insert(point) {
		if (!this.boundary.contains(point)) {
			return;
		}
		if (this.points.length < this.capacity) {
			this.points.push(point);
			point.material.color.set(this.color);
		}
		else {
			if (!this.divided) {
				this.subdivide();
			}
			this.topRightFront.insert(point);
			this.topLeftFront.insert(point);
			this.bottomRightFront.insert(point);
			this.bottomLeftFront.insert(point);
			this.topRightBack.insert(point);
			this.topLeftBack.insert(point);
			this.bottomRightBack.insert(point);
			this.bottomLeftBack.insert(point);
		}
	}

	query(range, found) {
		if (this.boundary.intersects(range)) {
			for (let p of this.points) {
				if (range.contains(p)) {
					p.material.color.set(new THREE.Color(1, 1, 1));
					found.push(p);
				}
			}
			if (this.divided) {
				this.topRightFront.query(range, found);
				this.topLeftFront.query(range, found);
				this.bottomRightFront.query(range, found);
				this.bottomLeftFront.query(range, found);
				this.topRightBack.query(range, found);
				this.topLeftBack.query(range, found);
				this.bottomRightBack.query(range, found);
				this.bottomLeftBack.query(range, found);
			}
		}
	}

	show() {
		
	}
}
