/**
 * Handles all collision detection and response logic in the game.
 * Interacts with the {@link World} instance and its components (character, enemies, items).
 */
class CollisionManager {
  /**
   * Creates a new CollisionManager.
   * @param {World} world - The game world instance.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Runs all collision checks in the game loop.
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
   * Applies damage to the character and updates the status bar.
   * @param {number} dmg - The amount of damage to apply.
   */
  applyDamageToCharacterAndShowUpdate(dmg) {
    this.world.character.hit(dmg);
    this.world.statusBar?.setPercentage?.(this.world.character.energy);
  }

  /**
   * Checks if the character is colliding with the endboss.
   */
  checkCollisionsCharacterWithEndboss() {
    const boss = this.world.level.enemies.find(e => e instanceof Endboss);
    if (!boss) return;

    if (this.isEndbossCollisionActive(boss)) {
      this.handleCharacterEndbossHit(boss);
      this.handleEndbossCharacterCollisionStart(boss);
    } else {
      this.handleEndbossCharacterCollisionEnd(boss);
    }
  }

  /**
   * Determines if the character-endboss collision is valid and active.
   * @param {Endboss} boss
   * @returns {boolean}
   */
  isEndbossCollisionActive(boss) {
    return boss?.isDeadEndboss?.() === false &&
      !this.world.gameOver &&
      !this.world.character.isHurt?.() &&
      this.world.character.isColliding?.(boss);
  }

  /**
   * Applies damage to the character when hit by the endboss.
   * @param {Endboss} boss
   */
  handleCharacterEndbossHit(boss) {
    this.applyDamageToCharacterAndShowUpdate(boss.damage);
    if (this.world.character.isDead()) this.triggerGameOverLose();
  }

  /**
   * Handles attack animation and logic for the endboss when colliding with the character.
   * @param {Endboss} boss
   */
  handleEndbossCharacterCollisionStart(boss) {
    boss.handleCharacterCollision?.();

    const shouldAttack = !boss.isDeadEndboss?.() &&
      !boss.isAttacking &&
      Date.now() - boss.lastAttackTime > boss.attackCooldown;

    if (shouldAttack) {
      boss.isAttacking = true;
      boss.lastAttackTime = Date.now();
      boss.playAnimationOnce?.(boss.IMAGES_ATTACK, () => {
        boss.isAttacking = false;
        boss.handleCharacterCollisionEnd?.();
      });
    }
  }

  /**
   * Ends the character-endboss collision interaction if previously active.
   * @param {Endboss} boss
   */
  handleEndbossCharacterCollisionEnd(boss) {
    if (boss.isCollidingWithCharacter) {
      boss.handleCharacterCollisionEnd?.();
    }
  }

  /**
   * Checks collisions between the character and all regular enemies.
   */
  checkCollisionsCharacterWithEnemies() {
    this.world.level.enemies.forEach(e => {
      if (!(e instanceof Endboss)) this.checkCollisionWithNormalEnemy(e);
    });
  }

  /**
   * Checks collision with one regular enemy and handles hit logic.
   * @param {MovableObject} enemy
   */
  checkCollisionWithNormalEnemy(enemy) {
    if (this.isEnemyCollisionActive(enemy)) {
      this.handleCharacterEnemyHit(enemy);
    }
  }

  /**
   * Determines if a collision with an enemy is active and valid.
   * @param {MovableObject} enemy
   * @returns {boolean}
   */
  isEnemyCollisionActive(enemy) {
    return enemy?.isDead?.() === false &&
      !this.world.gameOver &&
      !this.world.character.isHurt?.() &&
      this.world.character.isColliding?.(enemy);
  }

  /**
   * Applies damage when character is hit by a normal enemy.
   * @param {MovableObject} enemy
   */
  handleCharacterEnemyHit(enemy) {
    const dmg = typeof enemy.damage === 'number' ? enemy.damage : 5;
    this.applyDamageToCharacterAndShowUpdate(dmg);
    if (this.world.character.isDead()) this.triggerGameOverLose();
  }

  /**
   * Checks if the character is jumping on an enemy and defeats it.
   */
  checkCollisionsCharacterJumpOnEnemy() {
    for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
      const e = this.world.level.enemies[i];
      if (
        e?.isDead?.() === false &&
        this.world.character.isColliding?.(e) &&
        this.world.character.isJumpingOn?.(e)
      ) {
        this.handleEnemyDefeatedByJump(e);
      }
    }
  }

  /**
   * Handles enemy defeat logic when character jumps on it.
   * @param {MovableObject} enemy
   */
  handleEnemyDefeatedByJump(enemy) {
    this.world.character.speedY = 5;
    enemy.setDead?.();
    this.scheduleEnemyRemoval(enemy);
    this.world.audioManager?.playSound?.('chickenDead');
  }

  /**
   * Schedules enemy removal from the level after delay.
   * @param {MovableObject} enemy
   */
  scheduleEnemyRemoval(enemy) {
    setTimeout(() => {
      const i = this.world.level.enemies.indexOf(enemy);
      if (i > -1) this.world.level.enemies.splice(i, 1);
    }, 500);
  }

  /**
   * Checks for character collision with coins and collects them.
   */
  checkCollisionsCharacterWithCoins() {
    for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
      const coin = this.world.level.coins[i];
      if (this.world.character.isColliding?.(coin)) {
        this.world.character.collectCoin?.(coin);
        this.world.level.coins.splice(i, 1);
      }
    }
  }

  /**
   * Checks for character collision with bottles and collects them.
   */
  checkCollisionsCharacterWithBottles() {
    for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.world.level.bottles[i];
      if (this.world.character.isColliding?.(bottle)) {
        this.world.character.collectBottle?.(bottle);
        this.world.level.bottles.splice(i, 1);
      }
    }
  }

  /**
   * Checks collisions between throwable bottles and enemies.
   */
  checkCollisionsThrowableObjectsWithEnemies() {
    this.world.throwableObjects.forEach(bottle => {
      if (!bottle.isSplashed) {
        for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
          const enemy = this.world.level.enemies[i];
          if (enemy.isColliding?.(bottle)) {
            this.handleBottleHitsEnemy(bottle, enemy);
            break;
          }
        }
      }
    });
  }

  /**
   * Handles logic when a bottle hits any enemy.
   * @param {ThrowableObject} bottle
   * @param {MovableObject} enemy
   */
  handleBottleHitsEnemy(bottle, enemy) {
    enemy instanceof Endboss
      ? this.handleBottleHitsEndboss(bottle, enemy)
      : this.handleBottleHitsNormalEnemy(bottle, enemy);

    this.handleBottleSplatAndRemoval(bottle);
  }

  /**
   * Applies damage to the endboss when hit by a bottle.
   * @param {ThrowableObject} bottle
   * @param {Endboss} boss
   */
  handleBottleHitsEndboss(bottle, boss) {
    const dmg = typeof bottle.damage === 'number' ? bottle.damage : 20;
    boss.hitEndboss?.(dmg);
  }

  /**
   * Marks normal enemy as dead when hit by a bottle and removes it.
   * @param {ThrowableObject} bottle
   * @param {MovableObject} enemy
   */
  handleBottleHitsNormalEnemy(bottle, enemy) {
    enemy.setDead?.();
    this.world.audioManager?.playSound?.('chickenDead');
    this.scheduleEnemyRemoval(enemy);
  }

  /**
   * Handles bottle splat effect and sound after hitting an enemy.
   * @param {ThrowableObject} bottle
   */
  handleBottleSplatAndRemoval(bottle) {
    if (bottle.onTargetHit) {
      bottle.onTargetHit();
    } else {
      bottle.isSplashing = true;
      this.world.audioManager?.playSound?.('bottle_hit');
    }
  }

  /**
   * Ends the game with a loss if character dies.
   */
  triggerGameOverLose() {
    if (this.world.gameOver) return;
    this.world.gameOver = true;
    this.world.gameLose?.() || gameLose?.();
  }

  /**
   * Ends the game with a win (can be triggered externally).
   */
  triggerGameWin() {
    this.world.gameOver = true;
    this.world.gameWin?.() || gameWin?.();
  }
}
