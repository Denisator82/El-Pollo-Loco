/**
 * Manages all collision checks and basic collision handling in the game.
 * Works with a given World instance to access game objects.
 * @class
 */
class CollisionManager {
  world;

  /**
   * Creates an instance of CollisionManager.
   * @param {World} world - The game world instance.
   */
  constructor(world) {
    this.world = world;
    console.log("LOG: CollisionManager created."); // Optionaler Log
  }

  /**
   * Applies a specific amount of damage to the character and updates the health status bar.
   * @param {number} damageAmount - The amount of damage to apply.
   * @method
   */
  applyDamageToCharacterAndShowUpdate(damageAmount) {
    this.world.character.hit(damageAmount); // Charakter nimmt Schaden
    if (
      this.world.statusBar &&
      typeof this.world.statusBar.setPercentage === "function"
    ) {
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Performs all relevant collision checks for the current frame.
   * This method should be called by the World's main update loop.
   * @method
   */
  checkAllCollisions() {
    this.checkCollisionsCharacterWithEndboss();
    this.checkCollisionsCharacterWithEnemies();
    this.checkCollisionsCharacterJumpOnEnemy();
    this.checkCollisionsCharacterWithCoins();
    this.checkCollisionsCharacterWithBottles();
    this.checkCollisionsThrowableObjectsWithEnemies(); 
  }

  /**
   * Checks collision between the character and the endboss.
   * Calls helper methods to handle the consequences of the collision.
   * @method
   */
  checkCollisionsCharacterWithEndboss() {
    const endboss = this.world.level.enemies.find((e) => e instanceof Endboss);
    if (!endboss) {
      return; // Frühzeitig beenden
    }
    const collisionConditionMet = this.isEndbossCollisionActive(endboss);
    if (collisionConditionMet) {
      // Log bleibt hier, da es eine Info über das Ereignis ist
      console.log(
        "LOG: Character collided with living Endboss! Handling hit and boss reaction."
      );
      this.handleCharacterEndbossHit(endboss);
      this.handleEndbossCharacterCollisionStart(endboss);
    } else {
      this.handleEndbossCharacterCollisionEnd(endboss);
    }
  }

  /**
   * Checks if the core conditions for character collision with a living endboss are met.
   * @param {Endboss} endboss - The endboss instance.
   * @returns {boolean} True if collision conditions are met, false otherwise.
   * @method
   */
  isEndbossCollisionActive(endboss) {
    return (
      typeof endboss.isDeadEndboss === "function" &&
      !endboss.isDeadEndboss() &&
      !this.world.gameOver &&
      typeof this.world.character.isHurt === "function" &&
      !this.world.character.isHurt() &&
      typeof this.world.character.isColliding === "function" &&
      this.world.character.isColliding(endboss)
    );
  }

  /**
   * Handles applying damage to the character when hit by the endboss.
   * Checks for character death and triggers game over if necessary.
   * @param {Endboss} endboss - The endboss instance involved in the collision.
   * @method
   */
  handleCharacterEndbossHit(endboss) {
    const damageAmount = endboss.damage;
    this.applyDamageToCharacterAndShowUpdate(damageAmount);
    if (this.world.character.isDead()) {
      this.triggerGameOverLose();
    }
  }

  /**
   * Triggers the game over (lose) sequence.
   * @method
   */
  triggerGameOverLose() {
    console.log("LOG: Character is dead. Triggering Game Over (Lose)."); // Log
    this.world.gameOver = true;
    if (typeof this.world.gameLose === "function") {
      this.world.gameLose();
    } else if (typeof gameLose === "function") {
      gameLose();
    } else {
      console.error(
        "LOG: Global gameLose() function not found in World or globally."
      );
    }
  }

  /**
   * Tells the endboss that a collision with the character has started.
   * Calls the boss's handleCharacterCollision method if it exists and is not already colliding.
   * @param {Endboss} endboss - The endboss instance.
   * @method
   */
  handleEndbossCharacterCollisionStart(endboss) {
    if (
      typeof endboss.handleCharacterCollision === "function" &&
      !endboss.isCollidingWithCharacter
    ) {
      console.log("LOG: Endboss handleCharacterCollision() called (Start)."); // Log
      endboss.handleCharacterCollision();
    }
  }

  /**
   * Tells the endboss that a collision with the character has ended.
   * Calls the boss's handleCharacterCollisionEnd method if it exists and was previously colliding.
   * @param {Endboss} endboss - The endboss instance.
   * @method
   */
  handleEndbossCharacterCollisionEnd(endboss) {
    if (
      endboss.isCollidingWithCharacter &&
      typeof endboss.handleCharacterCollisionEnd === "function"
    ) {
      console.log("LOG: Endboss handleCharacterCollisionEnd() called (End)."); // Log
      endboss.handleCharacterCollisionEnd();
    }
  }

  /**
   * Checks for collisions between the character and all normal enemies (excluding Endboss).
   * Iterates through enemies and delegates specific collision handling.
   * @method
   */
  checkCollisionsCharacterWithEnemies() {
    this.world.level.enemies.forEach((enemy) => {
      if (!(enemy instanceof Endboss)) {
        this.checkCollisionWithNormalEnemy(enemy);
      }
    });
  }

  /**
   * Checks collision conditions for a single normal enemy and handles the hit if conditions are met.
   * @param {MovableObject} enemy - The normal enemy instance to check collision with.
   * @method
   */
  checkCollisionWithNormalEnemy(enemy) {
    const collisionConditionMet = this.isEnemyCollisionActive(enemy);
    if (collisionConditionMet) {
      // Log bleibt hier
      console.log(
        "LOG: Character collided with living normal enemy!",
        enemy.constructor.name
      );
      this.handleCharacterEnemyHit(enemy);
    }
  }

  /**
   * Checks if the core conditions for character collision with a living normal enemy are met.
   * @param {MovableObject} enemy - The normal enemy instance.
   * @returns {boolean} True if collision conditions are met, false otherwise.
   * @method
   */
  isEnemyCollisionActive(enemy) {
    return (
      typeof enemy.isDead === "function" &&
      !enemy.isDead() &&
      !this.world.gameOver &&
      typeof this.world.character.isHurt === "function" &&
      !this.world.character.isHurt() &&
      typeof this.world.character.isColliding === "function" &&
      this.world.character.isColliding(enemy)
    );
  }

  /**
   * Handles applying damage to the character when hit by a normal enemy.
   * Checks for character death and triggers game over if necessary.
   * @param {MovableObject} enemy - The enemy instance involved in the collision.
   * @method
   */
  handleCharacterEnemyHit(enemy) {
    const damageAmount = typeof enemy.damage === "number" ? enemy.damage : 5;
    this.applyDamageToCharacterAndShowUpdate(damageAmount);
    if (this.world.character.isDead()) {
      this.triggerGameOverLose();
    }
  }

  /**
   * Checks if the character jumps on a normal enemy (excluding Endboss).
   * If collision occurs while character is falling and above ground, the enemy is defeated.
   * @method
   */
  checkCollisionsCharacterJumpOnEnemy() {
    for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.world.level.enemies[i];
      if (!(enemy instanceof Endboss)) {
        const isJumpAttackCollision =
          typeof enemy.isDead === "function" &&
          !enemy.isDead() &&
          typeof this.world.character.isColliding === "function" &&
          this.world.character.isColliding(enemy) &&
          typeof this.world.character.isAboveGround === "function" &&
          this.world.character.isAboveGround() &&
          typeof this.world.character.speedY === "number" &&
          this.world.character.speedY < 0;

        if (isJumpAttackCollision) {
          this.handleEnemyDefeatedByJump(enemy, i);
        }
      }
    }
  }

  /**
   * Handles the immediate consequences when a normal enemy is defeated by the character's jump attack.
   * Triggers character jump-back, sets enemy dead state, and plays sound.
   * Schedules the removal via a helper function.
   * @param {MovableObject} enemy - The enemy instance that was defeated.
   * @param {number} enemyIndex - The index of the defeated enemy (wird hier nicht mehr direkt für splice genutzt, aber kann z.B. für Debugging bleiben).
   * @method
   */
  handleEnemyDefeatedByJump(enemy, enemyIndex) {
    if (typeof this.world.character.jump === "function") {
      this.world.character.jump();
    }
    if (typeof enemy.isDead === "boolean") {
      enemy.isDead = true;
    }
    if (
      this.world.audioManager &&
      typeof this.world.audioManager.playSound === "function"
    ) {
      if (enemy instanceof Chicken)
        this.world.audioManager.playSound("chickenDead");
      if (enemy instanceof ChickenMini)
        this.world.audioManager.playSound("chickenDead");
    }
    this.scheduleEnemyRemoval(enemy);
  }

  /**
   * Schedules the removal of a defeated enemy from the world after a delay.
   * @param {MovableObject} enemy - The defeated enemy instance to be removed.
   * @method
   */
  scheduleEnemyRemoval(enemy) {
    const deathAnimationDuration = 500;

    setTimeout(() => {
      const currentEnemyIndex = this.world.level.enemies.indexOf(enemy);
      if (currentEnemyIndex > -1) {
        this.world.level.enemies.splice(currentEnemyIndex, 1);
      }
    }, deathAnimationDuration);
  }

// In collision_manager.class.js, innerhalb der Klasse CollisionManager

/**
 * Checks collision between character and collectible coins.
 * If a collision is detected, the coin is collected and removed from the level.
 * @method
 */
checkCollisionsCharacterWithCoins() {
    for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
        const coin = this.world.level.coins[i];
        if (typeof this.world.character.isColliding === 'function' && this.world.character.isColliding(coin)) {
            this.handleCoinCollection(coin, i);
        }
    }
}

/**
 * Handles the process of collecting a single coin.
 * Triggers character collection logic, updates world counter/status bar, and removes the coin.
 * @param {CollectibleObject} coin - The coin object being collected.
 * @param {number} coinIndex - The index of the coin in the coins array.
 * @method
 */
handleCoinCollection(coin, coinIndex) {
    if (typeof this.world.character.collectCoin === 'function') {
        this.world.character.collectCoin(coin);
    } else {
        this.world.coinCounter++;
    }
    this.updateCoinStatusBarInWorld();
    this.world.level.coins.splice(coinIndex, 1);
}

/**
 * Updates the coin status bar displayed in the UI based on the collected coin count.
 * @method
 */
updateCoinStatusBarInWorld() {
     const collectedCount = this.world.character && typeof this.world.character.coinsCollected === 'number' ? this.world.character.coinsCollected : this.world.coinCounter;
     const totalCoinsInLevel = this.world.level.coins.length + collectedCount;
     const percentage = totalCoinsInLevel > 0 ? (collectedCount / totalCoinsInLevel) * 100 : 0;
     if (this.world.statusBarCoin && typeof this.world.statusBarCoin.setPercentage === 'function') {
         this.world.statusBarCoin.setPercentage(percentage);
     }
}

/**
 * Checks collision between character and collectible bottles.
 * If a collision is detected, the bottle is collected and removed from the level.
 * @method
 */
checkCollisionsCharacterWithBottles() {
    for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
        const bottle = this.world.level.bottles[i];
        if (typeof this.world.character.isColliding === 'function' && this.world.character.isColliding(bottle)) {
            this.handleCollectibleBottleCollection(bottle, i);
        }
    }
}

/**
 * Handles the process of collecting a single collectible bottle.
 * Triggers character collection logic, updates bottle status bar, and removes the bottle.
 * @param {CollectibleObject} bottle - The collectible bottle object being collected.
 * @param {number} bottleIndex - The index of the bottle in the bottles array.
 * @method
 */
handleCollectibleBottleCollection(bottle, bottleIndex) {
    if (typeof this.world.character.collectBottle === 'function') {
        this.world.character.collectBottle(bottle);
    }
    this.updateBottleStatusBarInWorld();
    this.world.level.bottles.splice(bottleIndex, 1);
}

/**
 * Updates the bottle status bar displayed in the UI based on the collected bottle count.
 * @method
 */
updateBottleStatusBarInWorld() {
     const collectedCount = this.world.character && typeof this.world.character.bottlesCollected === 'number' ? this.world.character.bottlesCollected : 0;
     const maxBottlesForStatusBar = 8;
     const percentage = maxBottlesForStatusBar > 0 ? (collectedCount / maxBottlesForStatusBar) * 100 : 0;
     if (this.world.statusBarBottle && typeof this.world.statusBarBottle.setPercentage === 'function') {
         this.world.statusBarBottle.setPercentage(percentage);
     }
}

/**
 * Checks collisions between all active throwable objects (bottles) and all enemies.
 * Delegates the handling of a bottle hitting an enemy to a helper method.
 * @method
 */
checkCollisionsThrowableObjectsWithEnemies() {
    this.world.throwableObjects.forEach(bottle => {
        if (!bottle.isSplashed) {
            for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
                const enemy = this.world.level.enemies[i];
                if (typeof enemy.isColliding === 'function' && enemy.isColliding(bottle)) {
                    console.log('LOG: Bottle collision detected with enemy!', enemy.constructor.name); // Log
                    this.handleBottleHitsEnemy(bottle, enemy, i);
                    break;
                }
            }
        }
    });
}

  /**
   * Triggers the game over (lose) sequence.
   * Sets the game over flag and calls the global game lose function.
   * @method
   */
  triggerGameOverLose() {
    console.log("LOG: Character is dead. Triggering Game Over (Lose).");
    this.world.gameOver = true;
    this.callGameLoseFunction();
  }

  /**
   * Calls the appropriate game lose function (in World or globally).
   * @method
   */
  callGameLoseFunction() {
    if (typeof this.world.gameLose === "function") {
      this.world.gameLose();
    } else if (typeof gameLose === "function") {
    
      gameLose();
    } else {
      console.error(
        "LOG: Global gameLose() function not found in World or globally."
      );
    }
  }
}
