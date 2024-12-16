const db = require('../db'); 

exports.createProgram = (req, res) => {
    const { name, description, created_by, assigned_to, participants, progress, remarks } = req.body;

    const query = `
        INSERT INTO programs (name, description, created_by, assigned_to, participants, progress, remarks) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [name, description, created_by, assigned_to, JSON.stringify(participants), progress, remarks], (err, result) => {
        if (err) {
            console.error('Error creating program:', err);
            return res.status(500).json({ error: 'Error creating program' });
        }
        res.status(201).json({ message: 'Program created successfully', programId: result.insertId });
    });
};

// Get All Programs
exports.getAllPrograms = (req, res) => {
    const query = `
        SELECT 
            programs.id, 
            programs.name, 
            programs.description, 
            programs.status,
            programs.participants,   // This should be a CSV string
            programs.progress,
            programs.remarks,
            programs.created_at, 
            programs.updated_at,
            u1.name AS created_by_name,
            u2.name AS assigned_to_name
        FROM programs
        LEFT JOIN users u1 ON programs.created_by = u1.id
        LEFT JOIN users u2 ON programs.assigned_to = u2.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching programs:', err);
            return res.status(500).json({ error: 'Error fetching programs' });
        }
        
        // Ensure that participants is converted to an array before sending to frontend
        results.forEach(program => {
            if (program.participants) {
                program.participants = program.participants.split(',');  // Convert CSV to array
            }
        });

        res.status(200).json(results);
    });
};
// Backend: Controller to fetch all users with role 'participant'
exports.getAllParticipants = (req, res) => {
    const query = 'SELECT id, name FROM users WHERE role = "participant"';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching participants:', err);
            return res.status(500).json({ error: 'Error fetching participants' });
        }
        res.status(200).json(results);
    });
};


// Update Program
exports.updateProgram = (req, res) => {
    const { id } = req.params;
    const { name, description, assigned_to, status, participants, progress, remarks } = req.body;

    const query = `
        UPDATE programs 
        SET name = ?, description = ?, assigned_to = ?, status = ?, participants = ?, progress = ?, remarks = ?
        WHERE id = ?
    `;

    db.query(query, [name, description, assigned_to, status, JSON.stringify(participants), progress, remarks, id], (err) => {
        if (err) {
            console.error('Error updating program:', err);
            return res.status(500).json({ error: 'Error updating program' });
        }
        res.status(200).json({ message: 'Program updated successfully' });
    });
};

// Delete Program
exports.deleteProgram = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM programs WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting program:', err);
            return res.status(500).json({ error: 'Error deleting program' });
        }
        res.status(200).json({ message: 'Program deleted successfully' });
    });
};

// Get Programs by User Role
exports.getProgramsByRole = (req, res) => {
    const { role, userId } = req.query;

    let query = `
    SELECT 
        programs.id, 
        programs.name, 
        programs.description, 
        programs.status,
        programs.participants,
        programs.progress,
        programs.remarks,
        programs.created_at, 
        programs.updated_at,
        u1.name AS created_by_name,
        u2.name AS assigned_to_name
    FROM programs
    LEFT JOIN users u1 ON programs.created_by = u1.id
    LEFT JOIN users u2 ON programs.assigned_to = u2.id
`;
    const params = [];

    if (role === 'professional') {
        query += ' WHERE assigned_to = ? ';
        params.push(userId);
    } else if (role === 'participant') {
        query = `SELECT * FROM programs WHERE JSON_CONTAINS(participants, ?)`; // Check if user is a participant
        params.push(`"${userId}"`);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching programs by role:', err);
            return res.status(500).json({ error: 'Error fetching programs by role' });
        }
        res.status(200).json(results);
    });
};

// Add Participant to Program
exports.addParticipant = (req, res) => {
    const { programId, userId } = req.body;

    const query = `
        UPDATE programs 
        SET participants = JSON_ARRAY_APPEND(participants, '$', ?) 
        WHERE id = ?
    `;
    db.query(query, [userId, programId], (err) => {
        if (err) {
            console.error('Error adding participant:', err);
            return res.status(500).json({ error: 'Error adding participant' });
        }
        res.status(200).json({ message: 'Participant added successfully' });
    });
};

// Get All Professionals
exports.getAllProfessionals = (req, res) => {
    const query = 'SELECT id, name FROM users WHERE role = "professional"';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching professionals' });
        }
        res.status(200).json(results);
    });
};
// Get Programs Assigned to a Professional
// Update Program
exports.updateProgrambyProfessional = (req, res) => {
    const { id } = req.params;
    const { progress, remarks } = req.body;
  
    const query = `
      UPDATE programs 
      SET progress = ?, remarks = ?
      WHERE id = ?
    `;
  
    db.query(query, [progress, remarks, id], (err) => {
      if (err) {
        console.error('Error updating program:', err);
        return res.status(500).json({ error: 'Error updating program' });
      }
      res.status(200).json({ message: 'Program updated successfully' });
    });
  };

// Add Participant to a Program
// Update the program's participants field
exports.addParticipant = (req, res) => {
    const { programId, userId } = req.body;

    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserQuery, [userId], (err, userResults) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Error checking user' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the program exists
        const checkProgramQuery = 'SELECT * FROM programs WHERE id = ?';
        db.query(checkProgramQuery, [programId], (err, programResults) => {
            if (err) {
                console.error('Error checking program:', err);
                return res.status(500).json({ error: 'Error checking program' });
            }

            if (programResults.length === 0) {
                return res.status(404).json({ error: 'Program not found' });
            }

            // Retrieve the program and participants (stored as comma-separated values)
            const program = programResults[0];
            let participants = program.participants ? program.participants.split(',') : [];

            // Check if the user is already a participant
            if (participants.includes(userId.toString())) {
                return res.status(400).json({ error: 'User is already a participant in this program' });
            }

            // Add the user to the participants array
            participants.push(userId);

            // Update the program's participants in the database
            const updateQuery = `
                UPDATE programs 
                SET participants = ? 
                WHERE id = ?
            `;
            db.query(updateQuery, [participants.join(','), programId], (err) => {
                if (err) {
                    console.error('Error adding participant:', err);
                    return res.status(500).json({ error: 'Error adding participant' });
                }
                res.status(200).json({ message: 'Participant added successfully' });
            });
        });
    });
};

// Remove Participant
exports.removeParticipant = (req, res) => {
    const { programId, userId } = req.body;

    const checkProgramQuery = 'SELECT * FROM programs WHERE id = ?';
    db.query(checkProgramQuery, [programId], (err, programResults) => {
        if (err) {
            console.error('Error checking program:', err);
            return res.status(500).json({ error: 'Error checking program' });
        }

        if (programResults.length === 0) {
            return res.status(404).json({ error: 'Program not found' });
        }

        // Retrieve the program and participants (stored as comma-separated values)
        const program = programResults[0];
        let participants = program.participants ? program.participants.split(',') : [];

        // Remove the user from the participants array
        participants = participants.filter(participant => participant !== userId.toString());

        // Update the program's participants in the database
        const updateQuery = `
            UPDATE programs 
            SET participants = ? 
            WHERE id = ?
        `;
        db.query(updateQuery, [participants.join(',') || null, programId], (err) => {
            if (err) {
                console.error('Error removing participant:', err);
                return res.status(500).json({ error: 'Error removing participant' });
            }
            res.status(200).json({ message: 'Participant removed successfully' });
        });
    });
};
