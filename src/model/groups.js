
module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    'Groups',
    {
      id: {
        // Avoid usage of auto-increment numbers, UUID is a better choice
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Group ID',
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        comment: 'Group title',
        // setter to standardize
        set(val) {
          this.setDataValue(
            'title',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        }
      },
      description: {
        type: DataTypes.STRING,
        comment: 'short description of group'
      },
      metadatas: {
        type: DataTypes.JSON,
        // Not null management
        allowNull: false,
        comment: 'Group metadata'
      },
    },
    {
      // logical delete over physical delete
      paranoid: true,

    }
  );

  Groups.associate = models => {
    Groups.belongsToMany(models.Users, { through: 'Members' });
  };

  return Groups;
};
