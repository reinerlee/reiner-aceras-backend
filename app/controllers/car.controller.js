const db = require("../models");
const Car = db.cars;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: cars } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, cars, totalPages, currentPage };
};

exports.create = (req, res) => {
  // Validate request

  if (!req.body.model) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Car
  const car = {
    model: req.body.model,
    color: req.body.color
  };
  // Save Car in the database
  Car.create(car)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Car."
      });
    });
};

exports.stats = (req, res) => {
	// Validate request
	// Create a Car
	var condition = [];
	var response = [];
	response = {
		'totalCars':0,
		'redCars':0,
		'yellowCars':0,
		'blueCars':0,
	};
	Car.findAndCountAll({ where: condition })
		.then(data => {
			response.totalCars = data.count;
		})
	Car.findAndCountAll({ where: [{color: 'Red'}] })
		.then(data => {
			response.redCars = data.count;
		
	})
	Car.findAndCountAll({ where: [{color: 'Yellow'}] })
		.then(data => {
			response.yellowCars = data.count;	
	})
	Car.findAndCountAll({ where: [{color: 'Blue'}] })
		.then(data => {
			response.blueCars = data.count;
			complete();
	})
	function complete() {
		res.send(response);
	}


};



// Retrieve all Cars from the database.
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
		
  const searchTerm = req.query.searchTerm;
  const color = req.query.color;
  const { limit, offset } = getPagination(page, size);
  
  var condition = {};
	if(searchTerm) {
		condition.model = { [Op.like]: `%${searchTerm}%` };
	}
	if(color) {
		condition.color = color;
	}
	
	
  Car.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
	  const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cars."
      });
    });
};

// Find a single Car with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Car.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Car with id=" + id
      });
    });
};

// Update a Car by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Car.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Car was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Car with id=${id}. Maybe Car was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Car with id=" + id
      });
    });
};

// Delete a Car with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Car.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Car was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Car with id=${id}. Maybe Car was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Car with id=" + id
      });
    });
};

// Delete all Cars from the database.
exports.deleteAll = (req, res) => {
  Car.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Car were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cars."
      });
    });
};
