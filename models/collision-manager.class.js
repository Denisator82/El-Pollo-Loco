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
    this.checkCollisionsCharacterWithCoins();
    this.checkCollisionsCharacterWithBottles();
    this.checkCollisionsCharacterJumpOnEnemy();
    this.checkCollisionsCharacterWithEnemies();
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

    if (typeof enemy.setDead === "function") {
        enemy.setDead();
    }

    // Ton wird nun nur von der Chicken-Instanz selbst abgespielt
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
    // } else {
    //     this.world.coinCounter++;
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
     const totalCoinsInLevel = 10
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

// In collision_manager.class.js, innerhalb der Klasse CollisionManager

/**
 * Handles the consequences when a throwable bottle hits an enemy.
 * Delegates specific handling based on the enemy type (Endboss or normal enemy).
 * Also handles the bottle's reaction (splashing/removal).
 * @param {ThrowableObject} bottle - The bottle that hit the enemy.
 * @param {MovableObject} enemy - The enemy that was hit.
 * @param {number} enemyIndex - The index of the enemy in the enemies array (useful for removal).
 * @method
 */
handleBottleHitsEnemy(bottle, enemy, enemyIndex) { // Behandelt den Treffer Flasche -> Gegner (< 14 Zeilen)
     // console.log(`LOG: Bottle hits ${enemy.constructor.name}.`); // Optionaler Log

     // Prüfe, ob der getroffene Gegner der Endboss ist
     if (enemy instanceof Endboss) {
          // Wenn Endboss getroffen, rufe spezielle Endboss-Treffer-Logik auf
          this.handleBottleHitsEndboss(bottle, enemy); // <-- Neue Hilfsfunktion für Endboss
     } else {
          // Wenn normaler Gegner (Chicken/MiniChicken) getroffen, rufe spezielle Normal-Gegner-Treffer-Logik auf
          this.handleBottleHitsNormalEnemy(bottle, enemy, enemyIndex); // <-- Neue Hilfsfunktion für normale Gegner
     }

     // Logik für die Reaktion der Flasche selbst (Zerplatzen, Sound, Entfernung)
     // Diese Logik gilt, egal welcher Gegner getroffen wurde.
     this.handleBottleSplatAndRemoval(bottle, enemyIndex); // <-- Neue Hilfsfunktion für Flaschen-Reaktion
     // Hinweis: enemyIndex wird hier vielleicht nicht für die Flasche benötigt,
     // aber die Flasche muss nach dem Treffer entfernt werden.
     // Die handleBottleSplatAndRemoval() wird sich um die Flasche kümmern.
} // <-- Ende von handleBottleHitsEnemy

    /**
     * Handles the consequences when a throwable bottle hits the Endboss.
     * Applies damage to the Endboss and triggers Game Win if the boss is defeated.
     * Assumes the bottle's reaction (splashing/removal) is handled separately.
     * @param {ThrowableObject} bottle - The bottle that hit the Endboss.
     * @param {Endboss} endboss - The Endboss instance that was hit.
     * @method
     */
    handleBottleHitsEndboss(bottle, endboss) { // Behandelt Treffer Flasche -> Endboss (< 14 Zeilen)
         // console.log('LOG: Bottle hits Endboss. Applying damage.'); // Optionaler Log

         // --- NEU: Hol den Schaden von der Flasche und wende ihn an ---
         // Stelle sicher, dass die Flasche eine 'damage' Property hat (haben wir vorher hinzugefügt).
         // Nutze einen Fallback-Wert (z.B. 20), falls die Property fehlt oder ungültig ist.
         const damageAmount = typeof bottle.damage === 'number' ? bottle.damage : 20; // Schaden von der Flasche holen

         // Wende den Schaden am Endboss an und übergib den Schaden
         // Stelle sicher, dass die Endboss-Methode 'hitEndboss' einen Parameter für den Schaden akzeptiert.
         if (typeof endboss.hitEndboss === 'function') {
              endboss.hitEndboss(damageAmount); // <-- RUFE hitEndboss MIT DEM SCHADEN AUF!
         } else {
              console.warn('LOG: Endboss hitEndboss method not found or is not a function.');
         }

         // Optional: Statusleiste des Endbosses aktualisieren (falls nicht im Endboss.hitEndboss() gemacht)
         // Stelle sicher, dass Endboss eine 'health' Property hat.
         if (this.world?.statusBarEndboss && typeof this.world.statusBarEndboss.setPercentage === 'function' && typeof endboss.health === 'number') { // Sicherere Prüfungen
                this.world.statusBarEndboss.setPercentage(endboss.health);
         }


         // Prüfe, ob der Endboss durch diesen Treffer gestorben ist
         // Stelle sicher, dass Endboss eine 'isDeadEndboss()' Methode hat.
         if (typeof endboss.isDeadEndboss === 'function' && endboss.isDeadEndboss()) {
              // console.log('LOG: Endboss is dead. Triggering Game Win.'); // Optionaler Log
              this.triggerGameWin(); // <-- Rufe die Game Win Logik auf (sollte im CollisionManager definiert sein)
         }
         // Die Flaschen-Reaktion (Splat & Removal) wird separat von handleBottleHitsEnemy gehandhabt.
    } // <-- Ende von handleBottleHitsEndboss


// In collision_manager.class.js, innerhalb der Klasse CollisionManager

/**
 * Handles the consequences when a throwable bottle hits a normal enemy (Chicken/MiniChicken).
 * Sets the enemy to dead and ensures its removal is scheduled (handled by CollisionManager helper).
 * Assumes the bottle's reaction (splashing/removal) is handled separately.
 * @param {ThrowableObject} bottle - The bottle that hit the enemy.
 * @param {MovableObject} enemy - The normal enemy instance that was hit.
 * @param {number} enemyIndex - The index of the enemy in the enemies array (for safe removal).
 * @method
 */
handleBottleHitsNormalEnemy(bottle, enemy, enemyIndex) { // Behandelt Treffer Flasche -> Normaler Gegner (< 14 Zeilen)
    // console.log(`LOG: Bottle hits normal enemy: ${enemy.constructor.name}. Setting dead status.`); // Optionaler Log

    // Setze den Gegner auf "tot". Annahme: Gegner hat eine setDead() Methode.
    // Die setDead() Methode im Gegner sollte seine isDead Flag setzen und ggf. Sounds/Animation starten.
    if (typeof enemy.setDead === 'function') {
        enemy.setDead(); // Rufe die setDead() Methode im Gegner auf
    } else {
        // Fallback, falls setDead() nicht existiert: Setze die isDead Property direkt
        if (typeof enemy.chickenIsDead === 'boolean') { // Prüfe auf die Property im Chicken/MiniChicken
            enemy.chickenIsDead = true;
        }
        // Optional: Sound hier spielen, falls nicht in setDead() im Gegner
        if (this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
             if (enemy instanceof Chicken || enemy instanceof ChickenMini) {
                  // console.log('LOG: Playing chicken dead sound (fallback in CollisionManager).'); // Optional
                  this.world.audioManager.playSound('chickenDead');
             }
        }
    }

    // Das Entfernen des Gegners aus der World-Liste nach der Todes-Animation wird vom CollisionManager gehandhabt
    // Die scheduleEnemyRemoval() Methode wird von handleEnemyDefeatedByJump() aufgerufen,
    // ABER wir rufen handleEnemyDefeatedByJump() bei Flaschen-Treffern NICHT auf.
    // Wir müssen die Entfernung hier planen, falls handleBottleHitsNormalEnemy() aufgerufen wird.
    // Annahme: scheduleEnemyRemoval kann jeden MovableObject Gegner entfernen
    this.scheduleEnemyRemoval(enemy); // <-- Rufe die Hilfsfunktion zur Zeitplanung der Entfernung auf
} // <-- Ende von handleBottleHitsNormalEnemy

// In collision_manager.class.js, innerhalb der Klasse CollisionManager

/**
 * Handles the bottle's reaction upon hitting a target (enemy or ground/wall).
 * Triggers the bottle's splash animation/sound and schedules its removal from the world.
 * @param {ThrowableObject} bottle - The bottle that hit a target.
 * @method
 */
handleBottleSplatAndRemoval(bottle) { // Behandelt Reaktion der Flasche bei Treffer (< 14 Zeilen)
     // console.log('LOG: Bottle hit a target. Handling bottle splat and removal.'); // Optionaler Log

     // Setze die Flasche auf "kollidiert" oder "zerplatzt", um ihre eigene Logik zu triggern.
     // Annahme: ThrowableObject hat eine isColliding oder isSplashed Property, die von seiner update() Methode geprüft wird.
     // Die update() Methode der Flasche sollte die Splash-Animation, den Sound und das Entfernen auslösen.
     if (bottle && typeof bottle.onTargetHit === 'function') {
          // Annahme: onTargetHit() im ThrowableObject handelt Splash-Animation, Sound und Entfernung
          bottle.onTargetHit(); // Rufe die Methode in der Flasche auf
     } else {
         // Fallback: Setze eine Flagge, die die Flaschen-Update-Logik erkennen kann
         if (bottle && typeof bottle.isSplashing === 'boolean') { // Annahme: Property isSplashing existiert
             bottle.isSplashing = true;
         } else if (bottle && typeof bottle.isColliding === 'boolean') { // Alternativ, falls isColliding genutzt wird
             bottle.isColliding = true;
         }
         // Sound abspielen, falls nicht in onTargetHit() in der Flasche
         if (this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
             // console.log('LOG: Playing bottle hit sound (fallback in CollisionManager).'); // Optional
             this.world.audioManager.playSound('bottle_hit'); // Annahme: bottle_hit sound
         }
         // Das Entfernen der Flasche aus der throwableObjects Liste muss auch geplant werden,
         // falls onTargetHit() das nicht selbst tut.
         // Da wir keine splice(i, 1) machen wollen, muss die Flasche sich selbst entfernen
         // oder wir planen das Entfernen hier nach einer Dauer der Splash-Animation.
         // Annahme: ThrowableObject entfernt sich selbst, wenn isSplashing/isColliding true ist und Animation abgelaufen ist.
         // Wenn die Flasche sich NICHT selbst entfernt, brauchen wir hier setTimeout/splice(bottle).
         // Basierend auf deinem früheren Code, setzt du bottle.isColliding = true und die Flasche entfernt sich. Das behalten wir bei.
         // Also hier keine Entfernung per splice!
     }
} // <-- Ende von handleBottleSplatAndRemoval

/**
 * Triggers the game win sequence.
 * Sets the game over flag and calls the global game win function.
 * @method
 */
triggerGameWin() { // Löst Spiel Gewinnen aus (< 14 Zeilen)
     console.log("LOG: Endboss is dead. Triggering Game Win."); // Log
     this.world.gameOver = true; // Setze Game Over Flag (kann auch ein win Flag sein)

     // Rufe die Game Win Funktion auf (kann in World oder global sein)
     if (typeof this.world.gameWin === "function") {
          this.world.gameWin();
     } else if (typeof gameWin === "function") { // Fallback zu globaler Funktion
          gameWin();
     } else {
          console.error(
               "LOG: Global gameWin() function not found in World or globally."
          );
     }
} // <-- Ende von triggerGameWin

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